import React from "react";
import { Link } from "react-router-dom";
import io from 'socket.io-client';

var sensorEndpoint = "http://127.0.0.1:5000/"
var socket = io.connect(sensorEndpoint, {
    // reconnection: true,
    // transports: ['websocket']
});

function JoinRmBtn(props){
    const data = {room: props.room}
    return (
        <Link to=''>
            <button id="join" 
                className="
                p-3
                text-xl 
                rounded-full 
                bg-green-300
                mt-1
            "
                onClick={() => {
                    socket.emit("join", {name: 'test name', room: 'test room'})
                }}
            >
                Join Game
            </button>
        </Link>
    )
}

export default JoinRmBtn