from turtle import update
from urllib import response
from flask import Flask, render_template, request, url_for
from flask_socketio import SocketIO, emit, join_room, send
import os
import logging
from logic.game import Game
import json
import snowflake.connector

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
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
    print(one_row[0])
    cs.execute("use warehouse {0}".format(SF_WH))
    cs.execute("select * from login where username='{0}' and password = hash('{1}')".format("testuser", "foo"))
    one_row = cs.fetchone()
    print(one_row[0])
except:
    print("no user was found")
finally:
    cs.close()
#ctx.close()


rooms = {}

#delete after database setup
users=[{"username":"test","password":"test"},{"username":"test2","password":"test2"}]


def is_admin(id, room):
    return rooms[room].getAdmin()['sid'] == id

@socketio.on('connection')
def on_connect(data):
    print('user connected')

@socketio.on('disconnected')
def on_admin_disconnect(data):

    print('user disconnected')
    # need to implement a method in game.py that 
    # returns a players cards back to the deck 
    # if they happen to leave during a game
    for room in rooms:
        if is_admin(request.sid, room):
            del rooms[room]
    emit('leave')

@socketio.on("login")
def login(data):
    ##edit when we have access to database
    cs = ctx.cursor()
    authenticated = FALSE

    username = data["username"]
    password = data["password"]
    query = "select * from login where username='{0}' and password = hash('{1}')".format(username, password)
    print(query)

    try:
        cs.execute(query)
        one_row = cs.fetchone()
        print(one_row[0])
        #if at least one row is found the user authenticated
        authenticated = TRUE
        #add this data object to the users list
        users.append(data)
    except:
        print("no user was found")
    finally:
        cs.close()

    
    #can user data in users or the authenticatesd flag set above
    if data in users:
        emit("received","user logged in")
        return

    emit("error","Wrong Username/Password")
@socketio.on("signup")
def signUp(data):
    ##edit when we have access to database
    if data in users:
        emit("error","Username taken.")
        return
    users.append(data)
    emit("userCreated", "User created. Please log in")

# only emitted by players

@socketio.on('join')
def on_join(data):
    name = data['name']
    room = data['room']
    playerInfo = {}
    playerInfo['sid'] = request.sid
    playerInfo['name'] = name

    if room not in rooms:
        emit('room_does_not_exist', room)
        print('The room: \''+ room +'\' does not exist')
    elif rooms[room].playerExists(playerInfo):
        emit('user_already_in_room', to=request.sid) #read by client in JoinGame.js
        print(f"{playerInfo['name']}({playerInfo['sid']}) was denied to join room: {repr(rooms[room])}")
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
    
    if (room in rooms ): #or len(room) < 3
        emit('create', False) #read by client in JoinGame.js
        print('room not created')
    else:
        join_room(room)
        adminInfo = {}
        adminInfo['sid'] = request.sid
        adminInfo['name'] = name
        newGame = Game(adminInfo)
        rooms[room] = newGame
        emit('create', True) #read by client in CreateGame.js
        print(f'created room: {room}{repr(rooms[room])}') #repr() calls __repr__() in whatever object you pass it, in this case game.py

@socketio.on('start_game')
def on_start_game(data):
    room = data
    rooms[room].gameStart()
    print(f"starting game! {rooms[room].getPlayerTurn().getName()} goes first. Upcard is {rooms[room].upcard().long_name}")  
    turnData = rooms[room].getPlayerTurn().getName()
    upcardData = rooms[room].upcard().toDict()

    for p in rooms[room].players:
        playerCards, opponentCards = rooms[room].getCardState(p)
        emit('move_to_game_start', {'turn':turnData, 'upcard':upcardData, 'hand':playerCards, 'opponents':opponentCards}, to=p.getSID())
        print("sent info to " + p.getName())

@socketio.on("draw")
def draw(data):
    result,message = checkData(data,request.sid)

    print(result,message)
    if result=="error":
        emit(result,message,to=request.sid)
        return
    
    result, message= rooms[data["room"]].draw()
    if result == "error":
        emit(result,message,to=request.sid)
        return
    elif result == "next":
        rooms[data["room"]].nextTurn()

    update(message,request.sid,data["room"])

@socketio.on("deal")
def deal(data):
    result,message = checkData(data,request.sid)
    print(result,message)
    if result=="error":
        emit(result,message,to=request.sid)
        return
    
    result, message= rooms[data["room"]].deal(data)
    if result == "error":
        emit(result,message,to=request.sid)
        return
    elif result =="winner":
        emit('winner',to=data["room"])
    elif result == "choose suit":
        emit(result,True,to=request.sid)
    elif result == "next":
        rooms[data["room"]].nextTurn()
    else:
        print("unknown result",result)
        return

    update(message,request.sid,data["room"])

@socketio.on("setSuit")
def setSuit(data):
    result,message = checkData(data,request.sid)
    print(result,message)
    if result=="error":
        emit(result,message,to=request.sid)
        return

    result = rooms[data["room"]].setSuit(data["suit"])

    rooms[data["room"]].nextTurn()
    update(result,request.sid,data["room"])

def checkData(data,SID):
    if not data["room"] in rooms:
        return "error", "room does not exist"

    if(SID != rooms[data["room"]].getPlayerTurn().getSID()):
        return "error", "Please wait"
    
    if rooms[data["room"]].gameOver == True:
        return "error", "sorry the game is over"

    return "valid"," current turn " + rooms[data["room"]].playerTurn.getName()

def update(message,SID,room):
    emit("updateHand",message["updateHand"],to=SID)
    #updates center card, current turn, and activesuit as a dict
    emit('updateDisplay', message["updateDisplay"], to=room)
    #returns the entire status of this particular game session
    #uncomment to see stats on client
    #emit("status",rooms[room].status(),to=SID)


if __name__ == '__main__':
	socketio.run(app, debug=True,port=5000) 