from turtle import update
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room,leave_room,close_room
import os
import logging
from logic.game import Game
from logic.Rules import Rules
import json
import snowflake.connector
import random

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

with open('creds.json') as f:
    data = json.load(f)
    username = data['username']
    password = data['password']
    SF_ACCOUNT = data["account"]
    SF_WH = data["warehouse"]

ctx = snowflake.connector.connect(
    user=username,
    password=password,
    account=SF_ACCOUNT
    )
cs = ctx.cursor()
try:
    #validate that we are reading from the data base and also test the login query with the sample user
    cs.execute("SELECT current_version()")
    one_row = cs.fetchone()
    cs.execute("use warehouse {0}".format(SF_WH))
    cs.execute("select * from login where username='{0}' and password = hash('{1}')".format("testuser", "foo"))
    one_row = cs.fetchone()
except:
    print("no user was found")
finally:
    cs.close()
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
@socketio.on("leaveRoom")
def leaveRoom(data):
    
    if not data["room"] in rooms:
        emit("leaveRoom")
        return

    room = data["room"]
        
    leave_room(room)

    rooms[room].removePlayer(data)
    
    emit("leaveRoom",f'You have left room {room}')
    emit("error",f'{data["user"]} has left the room',to=room)

    render = rooms[room].render()
    
    if len(rooms[room].players) >= 2:
        player = random.choice(rooms[room].players)
        
        if data["isAdmin"] == True:
            print(f'{player.getName()} is now admin')
            print(data["isAdmin"])
            emit("newAdmin",{"isAdmin":True},to=getSID(player.getSID()))
        updateRoom(render,room)
        return
    #do something if there is only one player left, del room ?
    #right now it just redirects the user to homepage,del room, and leave room in socket
    if len(rooms[data.get("room")].players) < 2:
        emit("leaveRoom",f'you are the only player in the room',to=room)
        close_room(room)
        #leave_room(room=room,sid=getSID(rooms[room].playerTurn.getSID()))
        
        print(f'no more players in room,deleting room {data["room"]}')
        del(rooms[data.get("room")])


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
    cs = ctx.cursor()
    authenticated = False

    username = data["username"]
    password = data["password"]
    query = "select * from login where username='{0}' and password = hash('{1}')".format(username, password)
    print(query)

    try:
        cs.execute(query)
        one_row = cs.fetchone()
        print(one_row[0])
        #if at least one row is found the user authenticated
        authenticated = True
        #add this data object to the users list
        users.append(data)
    except:
        print("no user was found")
        #uncomment these later when we can create a user using signup with database
        #emit("error","Wrong Username/Password")
        #return
    finally:
        cs.close()
    
    #can user data in users or the authenticatesd flag set above
    if data in users:
        emit("signed","User logged in")

    emit("error","Wrong Username/Password")
    
@socketio.on("signup")
def signUp(data):
    ##edit when we have access to database
    if data in users:
        emit("error","Username taken.")
        return
    users.append(data)
    emit("userCreated", "User created. Please log in")

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

@socketio.on('create')
def on_create(data):
    name = data['username']
    room = data['room']
    
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
        emit("leaveRoom","Room does not exist")

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
    
    updateRoom(message,data["room"]) #update center display, curr player hand, and opponent hands
    updatePlayer(message,data["ID"],data["room"])

@socketio.on("setSuit")
def setSuit(data):
    result,message = checkData(data)
   
    if result is Rules.ERROR: 
        return emit("error",message,to=getSID(data["ID"]))

    message = rooms[data["room"]].setSuit(data["suit"])

    updateRoom(message,data["room"])
    updatePlayer(message,data["ID"],data["room"])

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