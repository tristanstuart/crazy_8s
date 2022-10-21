import {useEffect, useState} from 'react'
import JoinRmBtn from "./buttons/JoinRoomBtn";


function JoinGame(props){

    const socket = props.socket
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
                                onChange={e=>setRoom(e.target.value)}
                                  
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