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
    print()    
    turnData = rooms[room].getPlayerTurn().getName()
    upcardData = rooms[room].upcard().toDict()

    for p in rooms[room].players:
        playerCards, opponentCards = rooms[room].getCardState(p)
        emit('move_to_game_start', {'turn':turnData, 'upcard':upcardData, 'hand':playerCards, 'opponents':opponentCards}, to=p.getSID())
        print()
        print("sent info to " + p.getName())

@socketio.on("action")
def action(data):

    result,message = checkData(data,request.sid)
    
    if result=="error":
        emit(result,message,to=request.sid)
        return
    print(result,message)
    # need to delete game associated with Room? or just make a reset function
    # on game.py and make a @socket.on("reset")
    # if the admin in the room wants another game with curr players
    if rooms[data["room"]].gameOver == True:
        emit("error","sorry the game is over")
        return

    #based on the result emit the message , could be a string or dict
    result,message = rooms[data["room"]].action(data)

    #split this all up
    
    #player didnt choose a matching suit/rank
    if result == "error":
        emit(result,message,to=request.sid)
        return
    #player played an eight card, and now they need to choose a suit
    elif result == "choose suit":
        emit("choose suit",True,to=request.sid)

    # no more cards in the deck, assmuming players are hoarding cards, dont know if 
    # this should end the game, probably just choose a random player to discard a random card
    elif result == "noCards":
        emit("error",message,to=data["room"])
        return
    # a deal/draw/setting a suit from an eight card was succesful, 
    # set the next expected player in game.py
    elif result == "next":
        rooms[data["room"]].nextTurn()
    # someone has won
    elif result == "noCards":
        emit("noCards",message)
        return
    elif result == "winner":
        emit("updateHand",message["data"]["userCards"],to=request.sid)
        emit('updateDisplay', message["data"]["updateDisplay"], to=data["room"])
        emit('winner', message["winner"], to=data["room"])
        return

    # updates the specific players hand display
    emit("updateHand",message["userCards"],to=request.sid)
    # updates the upCard,activeSuit, and whose current turn it is
    # the current turn may return the same name because,
    # a person dealing an eight card may attept to deal/draw , when setting the suit is expected
    emit('updateDisplay', message["updateDisplay"], to=data["room"])

    #returns the entire status of this particular game session
    emit("status",rooms[data["room"]].status(),to=request.sid)

@socketio.on("draw")
def draw(data):
    result,message = checkData(data,request.sid)

    if result=="error":
        print("error",message)
        print()
        emit(result,message,to=request.id)
        return
    print(data["player"],"wants to draw")
    print(result,message)
    print()
    result, message= rooms[data["room"]].draw()
    if result == "error":
        emit(result,message,to=request.sid)
        return
    elif result == "next":
        rooms[data["room"]].nextTurn()

    update(message,request.sid,data["room"])

@socketio.on("deal")
def deal(data):
    if not data["room"] in rooms:
        print("room does not exist")
        return

    if(request.sid != rooms[data["room"]].getPlayerTurn().getSID()):
        emit("error","Please wait",to=request.sid)
        return

@socketio.on("setSuit")
def setSuit(data):
    if not data["room"] in rooms:
        print("room does not exist")
        return

    if(request.sid != rooms[data["room"]].getPlayerTurn().getSID()):
        emit("error","Please wait",to=request.sid)
        return

def checkData(data,SID):
    if not data["room"] in rooms:
        print("room does not exist")
        return "error", "room does not exist"

    if(SID != rooms[data["room"]].getPlayerTurn().getSID()):
        return "error", "Please wait"
    print()
    return "valid"," current turn " + data["player"]

def update(message,SID,room):
    #update specific player hand
    emit("updateHand",message["userCards"],to=SID)
    #updates center card, current turn, and activesuit as a dict
    emit('updateDisplay', message["updateDisplay"], to=room)
    #returns the entire status of this particular game session
    emit("status",rooms[room].status(),to=SID)


if __name__ == '__main__':
	socketio.run(app, debug=True,port=5000) 