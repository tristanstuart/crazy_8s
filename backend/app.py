from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room,leave_room,close_room
import os
import logging
from logic.game import Game
from logic.Rules import Rules
import random
from logic.database import DB
from flask_cors import CORS

app = Flask(__name__)
SECRET = "areallybadsecreat"
app.config.update(
    DEBUG=True,
    SECRET_KEY = SECRET,
)

#instantiate the DB object initializing the connection
database = DB()

socketio = SocketIO(app,cors_allowed_origins="*")
socketio.init_app(app, cors_allowed_origins="*")
log = logging.getLogger("werkzeug")
log.disabled = True
CORS(app)#delete this later, only needed when running locally

#ctx.close()
count = [0]
rooms = {}
users=[{"username":"test","password":"test"},{"username":"test2","password":"test2"}]
#make db handle unique ID's for session
activePeople = {}
#move this to leaderboard db
scores = [
        {"name":"John","wins":100},
        {"name":"Goodman","wins":2000},
        {"name":"Johnny","wins":11}]

def is_admin(id, room):
    return rooms[room].getAdmin()['sid'] == id

@socketio.on('connect')
def on_connect(data):
    print(request.sid,"is connected")


@socketio.on("leaveRoom")
def leaveRoom(data):
    
    if not data["room"] in rooms:
        emit("leaveRoom")
        return

    room = data["room"]
        
    leave_room(room)

    #check if the player leaving is the curr player turn
    isCurrentPlayer = False
    if rooms[room].hasStarted():
        if rooms[room].playerTurn.getSID() == data["ID"]:
            isCurrentPlayer = True

    rooms[room].removePlayer(data)
    emit("leaveRoom",f'You have left room {room}')

    #this if for the waiting room before the game starts if all users happen to leave, just del room
    if len(rooms[room].players) == 0:
        print(f'deleting room {room}')
        close_room(room)
        del(rooms[room])
        return

    #if the player leaving happens to be admin, assign the admin role to someone new
    if data["isAdmin"] == True:
        player = random.choice(rooms[room].players)        
        emit("newAdmin",{"isAdmin":True},to=getSID(player.getSID()))
        print(f'{player.getName()} is now admin')

    #game hasn't started, just update the player list in waiting room
    if not data["inSession"]:
        emit('player_joined', rooms[room].playerList(), to=room)
        return

    if len(rooms[room].players) >= 2:
        #if the player leaving is the current expected player, look at new player 
        if isCurrentPlayer:
            emit("override",{"nextTurn":rooms[room].playerTurn.getName()},to=room)
        updateOpponents(room)
        emit("error",f'{data["user"]} has left the room',to=room)
        
        return
        
    # do something if there is only one player left while the game is in session, del room ? 
    # or just wait for reconnection, lets just del for rigth now
    if len(rooms[room].players) < 2:
        print(f'no more players in room,deleting room {room}')
        emit("leaveRoom",f'you are the only player in the room',to=room)
        close_room(room)
        del(rooms[room])

#emitted by admin when the game ends and they no longer want to keep playing with the same people
@socketio.on("closeGame")
def closeGame(data):
    room = data["room"]
    emit("leaveRoom","the admin does not want to restart the game",to=room)
    close_room(room)
    del rooms[room]

#emitted by admin when the game ends and want to restart the game with the same people,
#however the game is not started from here as the people still have the choice to leave 
@socketio.on("restartGame")
def restartGame(data):
    room = data["room"]
    rooms[room].reset()
    emit("move",f'move to waiting room {room}',to=room)

#set a clients newSID given to them by socketio, as it does not preserve it through the
#users session
@socketio.on("newSID")
def newSID(data):
    if activePeople.get(data["ID"]) == None:
        print("Error ID " + f'{data["ID"]}' + " not found")
        print("a new session will be given")
        createNewSessionUsingSID()
        return 
    print("assigning a new SID on server")
    activePeople[data["ID"]]["sid"] = request.sid
    emit("session",activePeople[data["ID"]])

#since react doesnt remember anything after a page refresh
# we need to create a session for a user on their side.
#to preserve gameInfo
@socketio.on("needSession")
def createNewSessionUsingSID():
    print("sending a new session")
    #refer to each new person by an ID, and store their request.sid
    #their sid would need to be updated as socketio ditches their id if the user
    #disconnects, additionally this logic should be on the db
    num = count[0]
    count[0] += 1
    activePeople[num] = { 
        "ID":num,
        "sid":request.sid
    }
    emit("session",activePeople[num])

@socketio.on("disconnect")
def disconnect():
    print(request.sid,"is disconnecting")

@socketio.on("login")
def login(data):
    ##edit when we have access to database
    authenticated = False
    print("in login")
    username = data["username"]
    password = data["password"]
    authenticated = database.authenticate(username, password) #returns True or False if the user authenticated

    if authenticated:
        users.append(data)
        print("authenticated!")
        emit("signuplistener","User logged in")
    else:
        print("authentication failed")
        emit("signuplistener","Wrong Username/Password")
    
    
@socketio.on("signup")
def signUp(data):
    print("in signup")
    username = data["username"]
    password = data["password"]
    secQues = data["question"]
    secAns = data["answer"]

    print(username + " " + password + " " + secQues + " " + secAns)
    result = False
    result = database.createUser(username, password, secQues, secAns)
    if result:
        print('User ' + username + ' was created!')
        emit("userCreated",'User ' + username + ' was created!')
    else:
        print('A user with that name already exists. Choose another user name')
        emit("error",'A user with that name already exists. Choose another user name')

#sent by client if they disconnected while in a gameSesion
#still needs to be finished
@socketio.on("pendingRoom")
def pending(data):
    if data["room"] in rooms:
        join_room(data["room"])
        emit("reJoin",f'successfully joined room {data["room"]}')
        return
    emit("leaveRoom","Error room " + f'{data["room"]}' + " not found")

@socketio.on('join')
def on_join(data):

    name = data['name']
    room = data['room']
    icon = data['icon']
    if rooms.get(room) == None:
        emit("error","No room provided")
    playerInfo = {}
    playerInfo['sid'] = data["ID"]
    playerInfo['name'] = name
    playerInfo['icon'] = icon

    if room not in rooms:
        emit('error',{"title":'This room does not exist',"message":'please join an existing game or create your own'})
        print('The room: \''+ room +'\' does not exist')
        return
    elif rooms[room].playerExists(playerInfo):
        emit("error",{"title":'Username is not available',"message":'Someone with this username is already in this room'})
        print(f"{playerInfo['name']}({playerInfo['sid']}) was denied to join room: {repr(rooms[room])}")
        return
    elif rooms.get(room).hasStarted():
        emit("error",{"title":"Game In Session","message":"Sorry this game is in Session"})
        return
    else:
        join_room(room)
        rooms[room].addPlayer(playerInfo)
        emit('player_joined', rooms[room].playerList(), to=room) #read by players in WaitingRoom.js
        print(f'{name} joined room {room}: {repr(rooms[room])}')        

@socketio.on('exists')
def exists(data):
    room = data['room']
    emit('exists', room in rooms)

@socketio.on('create')
def on_create(data):
    name = data['username']
    room = data['room']
    icon = data['icon']
    
    if (room in rooms ): #or len(room) < 3
        emit('create', False) #read by client in JoinGame.js
        print('room not created')
    else:
        join_room(room)
        adminInfo = {}
        adminInfo['sid'] = data["ID"]
        adminInfo['name'] = name
        adminInfo['icon'] = icon
        newGame = Game(adminInfo)
        rooms[room] = newGame
        emit('create', True) #read by client in CreateGame.js
        print(f'created room: {room}{repr(rooms[room])}') #repr() calls __repr__() in whatever object you pass it, in this case game.py

@socketio.on('start_game')
def on_start_game(data):
    room = data["room"]
    
    if rooms.get(room) == None:
        emit("leaveRoom","Room does not exist")

        return

    if rooms.get(room).hasStarted():
        emit("error","Cannot start a game that has already started")
        return

    if len(rooms[room].players) < 2:
        print("Need at least two players to start game in room",room)
        emit("error","Need at least two players to start the game :(")
        return

    rooms[room].gameStart()
    print(f"starting game! {rooms[room].getPlayerTurn().getName()} goes first. Upcard is {rooms[room].upcard().long_name}")  
    turnData = rooms[room].getPlayerTurn().getName()
    upcardData = rooms[room].upcard().toDict()

    for p in rooms[room].players:
        playerCards, opponentCards = rooms[room].getCardState(p)
        emit('move_to_game_start', {'turn':turnData, 'upCard':upcardData, 'hand':playerCards, 'opponents':opponentCards}, to=getSID(p.getSID()))
        print("sent info to " + p.getName())

@socketio.on("draw")
def draw(data):
    result,message = checkData(data)

    if result is Rules.ERROR: return emit("error",message,to=getSID(data["ID"]))
    
    result, message = rooms[data["room"]].draw()
    #no more cards
    if result is Rules.ERROR: return emit("error","There are no more cards to draw",to=getSID(data["ID"]))
    elif result is Rules.CHOOSE_SUIT: return emit("choose suit", "Please choose a suit",to=getSID(data["ID"]))

    updatePlayer(message,data["ID"],data["room"])
    
@socketio.on("deal")
def deal(data):
    # validate turn can be processed
    result,message = checkData(data) 
   
    # if invalid turn, send client error
    if result is Rules.ERROR: 
        return emit("error",message,to=getSID(data["ID"]))
 
    # otherwise process turn
    result, message = rooms[data["room"]].play_card(data) 
    
    # player made winning play
    if result is Rules.WINNER:
        addScore(message["updateDisplay"]["winner"])
    # player played an 8
    elif result is Rules.CHOOSE_SUIT:
       emit("choose suit", True ,to=getSID(data["ID"]))

    # invalid card
    elif result is Rules.ERROR: 
    #    updatePlayer(message,request.sid,data["room"])
       return emit("error", message ,to=getSID(data["ID"]))
    updatePlayer(message,data["ID"],data["room"])
    updateRoom(message,data["room"]) #update center display, curr player hand, and opponent hands

@socketio.on("setSuit")
def setSuit(data):
    result,message = checkData(data)
   
    if result is Rules.ERROR: 
        return emit("error",message,to=getSID(data["ID"]))

    message = rooms[data["room"]].setSuit(data["suit"])

    updateRoom(message,data["room"])
    updatePlayer(message,data["ID"],data["room"])

#only used when a player manually changes their icon.
#for icon initialization, see socket.on("join") or socket.on("create")
@socketio.on("setIconForPlayer")
def setIconForPlayer(data):
    room = data['room']
    playerSID = data['ID']
    icon = data['icon']

    for player in rooms[room].players:
        if player.getSID() == playerSID: # this code wont update the lobby's icon for the player  
            player.setIcon(icon)         # if the player isnt found here for whatever reason
            break
    emit('player_joined', rooms[room].playerList(), to=room) #update player and icon lists, for some reason the final player added to the game
                                                             #wont update icons properly unless they receive a player_joined even while in WaitingRoom
                                                             #no harm in firing this event so that's okay for now, but should be fixed eventually

#validates that the room exists, that it is the player's turn, and that the game hasn't ended
def checkData(data):
    if not data["room"] in rooms:
        emit("leaveRoom","Sorry the game you tried to join never existed")
        return Rules.ERROR, "room does not exist"

    if rooms[data["room"]].gameOver == True:
        return Rules.ERROR, "sorry the game is over"

    if(data["ID"] != rooms[data["room"]].getPlayerTurn().getSID()):
        print(rooms[data["room"]].getPlayerTurn())
        return Rules.ERROR, "Please wait"

    return Rules.VALID," current turn " + rooms[data["room"]].playerTurn.getName()

def updateRoom(message, room):
    #updates center card, current turn, and activesuit as a dict
    emit("updateDisplay", message["updateDisplay"], to=room)
    updateOpponents(room)
    
def updatePlayer(message, SID, room):
    #update specific playerhand, refers to them by request.sid as SID 
    emit("updateHand",message["updateHand"],to=getSID(SID))
    updateOpponents(room)
    
def updateOpponents(room):
    for p in rooms[room].players:#update all opponent card counts
        opponentCards = rooms[room].getCardState(p)[1] #function returns player and opponent hand info [1] on the end gets just the opponent info
        emit("updateOpponents", {'opponents':opponentCards}, to=getSID(p.getSID()))

def sortScores(val):
    return val["wins"]

def addScore(winner):
    for p in scores:
        if p["name"] == winner:
            p["wins"] += 1
            return

    scores.append({
        "name":winner,
        "wins":1})    

#gets a users SID based on their ID in activePeople dictionary
def getSID(ID):
    #if the server restarts it has no recollection of past ID's 
    if activePeople.get(ID) == None:
        print("not a known ID, a new one will be assigned")
        createNewSessionUsingSID()
        return

    return activePeople[ID]["sid"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/scores")
def leaderBoardScores():
    scores.sort(key=sortScores,reverse=True)
    return scores

if __name__ == '__main__':
	socketio.run(app) 