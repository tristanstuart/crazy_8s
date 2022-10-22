from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room
import os

from logic.game import Game

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
socketio = SocketIO(app,cors_allowed_origins="*")
socketio.init_app(app, cors_allowed_origins="*")

rooms = {}

games = {}

#delete after database setup
users=[{"username":"test","password":"test"},{"username":"marco","password":"marco"}]

@socketio.on("begin game")
def beginGame(data):
    
    if games.get(data["gameroom"]):
        print("game already exists")
        emit("error","Game already exists")
        return
    try:
        games[data["gameroom"]] = Game(data["players"])
        games[data["gameroom"]].gameStart()
    except:
        emit("error","there was an issue starting your game")

@socketio.on("action")
def action(data):
    print(data)
    games[data["gameroom"]].action(data["username"],data["action"],data["card"])

def is_admin(id, room):
    return rooms[room] == id

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

#login and signup

@socketio.on("login")
def login(data):
    ##edit when we have access to database
    print()

    if data in users:
        emit("received",data["username"])
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
    join_room(room)
    emit('join', data, room=room)
    print(f'{name} joined {room}')
    # print(data)

@socketio.on('exists')
def exists(data):
    room = data['room']
    emit('exists', room in rooms)

@socketio.on('create')
def on_create(data):
    name = data['username']
    room = data['room']
    print(type(room), room)
    if (room in rooms ): #or len(room) < 3
        emit('create', False)
        print('room not created')
    else:
        join_room(room)
        rooms[room] = request.sid
        emit('create', True)
        print(f'created room: {room}')
    
if __name__ == '__main__':
	socketio.run(app, debug=True,port=3000) 