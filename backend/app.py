from turtle import update
from urllib import response
from flask import Flask, render_template, request, url_for
from flask_socketio import SocketIO, emit, join_room, send
import os
import logging
from logic.game import Game

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
socketio = SocketIO(app,cors_allowed_origins="*")
socketio.init_app(app, cors_allowed_origins="*")
log = logging.getLogger("werkzeug")
log.disabled = True

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
    for room in rooms:
        if is_admin(request.sid, room):
            del rooms[room]
    emit('leave')

@socketio.on("login")
def login(data):
    ##edit when we have access to database
    
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
    # print(data)

@socketio.on('exists')
def exists(data):
    room = data['room']
    emit('exists', room in rooms)

# only emitted by admin

@socketio.on('create')
def on_create(data):
    name = data['username']
    room = data['room']
    #print(type(room), room)
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
    print("data",data)
    room = data
    rooms[room].gameStart()
    print(f"starting game! {rooms[room].getPlayerTurn().getName()} goes first. Upcard is {rooms[room].upcard().long_name}")
    
    turnData = rooms[room].getPlayerTurn().getName()
    upcardData = rooms[room].upcard().toDict()

    for p in rooms[room].players:
        playerCards, opponentCards = rooms[room].getCardState(p)
        emit('move_to_game_start', {'turn':turnData, 'upcard':upcardData, 'hand':playerCards, 'opponents':opponentCards}, to=p.getSID())
        print("sent info to " + p.getName())

@socketio.on("action")
def action(data):
    
    if not data["room"] in rooms:
        print("room does not exist")
        return
    
    if(data["player"] != rooms[data["room"]].getPlayerTurn().getName()):
        emit("error","it is not your turn")
        return
    
    result,message = rooms[data["room"]].action(data)

    #split this all up
    
    if result == "error":
        emit(result,message)
    elif result == "choose suit":
        emit(data["player"],message["userCards"])
        emit('updateDisplay', message["updateDisplay"], to=data["room"])
        emit("choose suit",True)
        
    elif result == "noCards":
        emit("error",message,to=data["room"])
    
    elif result == "next":
        print()
        emit(data["player"],message["userCards"])
        emit('updateDisplay', message["updateDisplay"], to=data["room"])
        rooms[data["room"]].nextTurn()
    
    elif result == "end":
        emit(data["player"],message["data"]["userCards"])
        emit('updateDisplay', message["data"]["updateDisplay"], to=data["room"])
        emit('end', message["winner"], to=data["room"])

if __name__ == '__main__':
	socketio.run(app, debug=True,port=5000) 