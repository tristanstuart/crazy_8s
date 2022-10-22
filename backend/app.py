from urllib import response
from flask import Flask, render_template, request, url_for
from flask_socketio import SocketIO, emit, join_room, send
import os

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
socketio = SocketIO(app,cors_allowed_origins="*")
socketio.init_app(app, cors_allowed_origins="*")



rooms = {}

#delete after database setup
users=[{"username":"test","password":"test"},{"username":"test2","password":"test2"}]


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
    join_room(room)
    emit('join', data, room=room)
    print(f'{name} joined {room}')
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