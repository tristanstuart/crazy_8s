import {useEffect, useState} from 'react'
import io from 'socket.io-client'
import JoinRmBtn from "./buttons/JoinRoomBtn";

var sensorEndpoint = "http://127.0.0.1:5000/"
var socket = io.connect(sensorEndpoint);

function JoinGame(){
    const [username,setUser] = useState("");
    const [room,setRoom] = useState("");

    useEffect(()=>{
        socket.on("received",e=>{
        console.log(e)
        })
      return ()=>{
        socket.off("received")
      }},[])  


        return (
            <div className="grid items-center justify-center h-screen bg-purple-300" >
                    <main>
                        <form id="start" >
                            <input 
                                id="name" 
                                type="text"  
                                placeholder="Enter Username" 
                                className="p-3 text-2xl rounded-full grid items-center justify-center"
                                onChange= {e => setUser(e.target.value)}
                            />
                            <input 
                                id="room" 
                                type="text" 
                                placeholder="Enter Room Code" 
                                className="p-3 text-2xl rounded-full mt-1"
                                input onChange={e=>setRoom(e.target.value)}
                                  
                            />
                        </form>
                            
                        
                        <JoinRmBtn 
                            name={username} 
                            room={room}
                            
                            
                        />
                    </main>    
    
            </div>
        )
}

export default JoinGame;