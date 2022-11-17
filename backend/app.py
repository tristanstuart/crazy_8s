from turtle import update
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room,leave_room
import os
import logging
from logic.game import Game
from logic.Rules import Rules
from logic.database import DB
import json
import snowflake.connector



app = Flask(__name__)
SECRET = "areallybadsecreat"
app.config.update(
    DEBUG=True,
    SECRET_KEY = SECRET,
)

socketio = SocketIO(app,cors_allowed_origins="*")
socketio.init_app(app, cors_allowed_origins="*")
log = logging.getLogger("werkzeug")
log.disabled = True


print()
#ctx.close()
count = [0]
rooms = {}
users=[{"username":"test","password":"test"},{"username":"test2","password":"test2"}]
#make db handle unique ID's for session
people = {}

def is_admin(id, room):
    return rooms[room].getAdmin()['sid'] == id

@socketio.on('connect')
def on_connect(data):
    print(request.sid,"is connected")

#set a clients newSID given to them by socketio, as it does not preserve it through the
#users session
@socketio.on("newSID")
def newSID(data):
    if people.get(data["ID"]) == None:
        print("Error ID " + f'{data["ID"]}' + " not found")
        print("a new session will be given")
        need()
        return 
    print("data on reconnect",data)
    print("assigning a new SID on server")
    people[data["ID"]]["sid"] = request.sid
    emit("session",people[data["ID"]])

#since react doesnt remember anything after a page refresh
# we need to create a session for a user on their side.
#to preserve gameInfo
@socketio.on("needSession")
def need():
    print("sending a new session")
    #refer to each new person by an ID, and store their request.sid
    #their sid would need to be updated as socketio ditches their id if the user
    #disconnects, additionally this logic should be on the db
    num = count[0]
    count[0] += 1
    people[num] = { 
        "ID":num,
        "sid":request.sid
    }
    emit("session",people[num])

@socketio.on("disconnect")
def dis():
    print(request.sid,"is disconnecting")

@socketio.on("login")
def login(data):
    ##edit when we have access to database
    authenticated = False

    username = data["username"]
    password = data["password"]
    authenticated = DB.authenticate(username, password) #returns True or False if the user authenticated

    if authenticated:
        users.append(data)
        emit("signed","User logged in")
    else:
        emit("error","Wrong Username/Password")
    
    
@socketio.on("signup")
def signUp(data):
    username = data["username"]
    password = data["password"]
    secQues = data["question"]
    secAns = data["answer"]

    result = DB.createUser
    if result:
        emit("userCreated",'User ' + username + ' was created!')
    else:
        emit("error",'A user with that name already exists. Choose another user name')

#sent by client if they disconnected while in a gameSesion
#still needs to be finished
@socketio.on("pendingRoom")
def pending(data):
    if data["room"] in rooms:
        print("that game is still going")
        join_room(data["room"])
        emit("reJoin","someonejoined")
        return
    emit("deadRoom","Error room " + f'{data["room"]}' + " not found")
    print("sorry bud " + f'{data["room"]}' + "does not exist")

@socketio.on('join')
def on_join(data):

    name = data['name']
    room = data['room']
    if rooms.get(room) == None:
        emit("error","No room provided")
    playerInfo = {}
    playerInfo['sid'] = data["ID"]
    playerInfo['name'] = name

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

# only emitted by admin

@socketio.on('create')
def on_create(data):
    name = data['username']
    room = data['room']
    
    #fix issues on client not updating data.room stored in sessionStorage
    #a user could leave the room automatically if they disconnect, but we cannot
    #assume they will refresh the page, so just do it here for them
    if data.get("oldRoom") != None:
        print("leaving old room",data["oldRoom"])
        leave_room(data["oldRoom"])
    
    if (room in rooms ): #or len(room) < 3
        emit('create', False) #read by client in JoinGame.js
        print('room not created')
    else:
        join_room(room)
        adminInfo = {}
        adminInfo['sid'] = data["ID"]
        adminInfo['name'] = name
        newGame = Game(adminInfo)
        rooms[room] = newGame
        emit('create', True) #read by client in CreateGame.js
        print(f'created room: {room}{repr(rooms[room])}') #repr() calls __repr__() in whatever object you pass it, in this case game.py

@socketio.on('start_game')
def on_start_game(data):
    room = data["room"]
    
    if rooms.get(room) == None:
        emit("error","game does not exist")
        return

    if rooms.get(room).hasStarted():
        emit("error","Cannot start a game that has already started")
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
        emit("winner",to=data["room"])
    # player played an 8
    elif result is Rules.CHOOSE_SUIT:
       emit("choose suit", True ,to=getSID(data["ID"]))

    # invalid card
    elif result is Rules.ERROR: 
    #    updatePlayer(message,request.sid,data["room"])
       return emit("error", message ,to=getSID(data["ID"]))
    
    updateRoom(message,data["ID"],data["room"]) #update center display, curr player hand, and opponent hands
    updatePlayer(message,data["ID"],data["room"])

@socketio.on("setSuit")
def setSuit(data):
    result,message = checkData(data)
   
    if result is Rules.ERROR: 
        return emit("error",message,to=getSID(data["ID"]))

    message = rooms[data["room"]].setSuit(data["suit"])

    updateRoom(message,data["ID"],data["room"])
    updatePlayer(message,data["ID"],data["room"])

#validates that the room exists, that it is the player's turn, and that the game hasn't ended
def checkData(data):
    if not data["room"] in rooms:
        return Rules.ERROR, "room does not exist"

    if rooms[data["room"]].gameOver == True:
        return Rules.ERROR, "sorry the game is over"

    if(data["ID"] != rooms[data["room"]].getPlayerTurn().getSID()):
        print(rooms[data["room"]].getPlayerTurn())
        return Rules.ERROR, "Please wait"

    return Rules.VALID," current turn " + rooms[data["room"]].playerTurn.getName()


def updateRoom(message,SID, room):
    #updates center card, current turn, and activesuit as a dict
    emit("updateDisplay", message["updateDisplay"], to=room)

    for p in rooms[room].players:#update all opponent card counts
        opponentCards = rooms[room].getCardState(p)[1] #function returns player and opponent hand info [1] on the end gets just the opponent info
        emit("updateOpponents", {'opponents':opponentCards}, to=getSID(p.getSID()))

def updatePlayer(message, SID, room):
    #update specific playerhand, refers to them by request.sid as SID 
    emit("updateHand",message["updateHand"],to=getSID(SID))
    for p in rooms[room].players:#update all opponent card counts
        opponentCards = rooms[room].getCardState(p)[1] #function returns player and opponent hand info [1] on the end gets just the opponent info
        emit("updateOpponents", {'opponents':opponentCards}, to=getSID(p.getSID()))

@app.route("/")
def index():
    return render_template("index.html")

#gets a users SID based on their ID in people dictionary
def getSID(ID):
    #if the server restarts it has no recollection of past ID's 
    if people.get(ID) == None:
        print("not a known ID, a new one will be assigned")
        need()
        return

    return people[ID]["sid"]

if __name__ == '__main__':
	socketio.run(app) 