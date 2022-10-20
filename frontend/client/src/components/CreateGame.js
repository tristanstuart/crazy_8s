import {useEffect, useState} from 'react'
import io from 'socket.io-client'
import AlertBox from './AlertBox';

var sensorEndpoint = "http://127.0.0.1:5000/"
var socket = io.connect(sensorEndpoint);

function CreateGame(){
    const [username,setUser] = useState("");
    const [room,setRoom] = useState("");
    const [error, setError] = useState(false)

    useEffect(()=>{
        socket.on("create",e=>{
            if (e == false) {
                console.log('room taken')
                setError(true)
                
            }
            else {
                console.log('room created')
                // TODO: create route to game here
            }
        })
      return ()=>{
        socket.off("received")
      }},[]) 

    const handleChange = (e) =>{
        setRoom(e.target.value);
        setError(false);
        return
      }

    return (
        // grid items-center justify-center h-screen text-xl bg-green-300
        <div className="grid items-center justify-center h-screen text-xl bg-green-300 ">
            <div className='flex-initial flex-wrap'>
                {error ? <AlertBox room={room}/> : null}
                {/* <AlertBox /> */}
                
                <form id="start">
                    <input 
                        type="text" 
                        id="user" 
                        placeholder="User Name" 
                        className="p-3 text-2xl rounded-full grid items-center justify-center mt-2" 
                        onChange= {e => setUser(e.target.value)}
                        />
                    <input 
                        id="room" 
                        type="text" 
                        placeholder="Room Name" 
                        className="p-3 text-2xl rounded-full mt-1 grid items-center justify-center"
                        onChange= {e => handleChange(e)}
                            
                        />
                </form>
                    <button 
                    className="p-2 rounded-full bg-blue-400 mt-1"
                    onClick={() => {
                        socket.emit("create", {username, room});
                    }}
                    >
                    Create Game</button>
            </div>
            
        </div>
    )
}

export default CreateGame;