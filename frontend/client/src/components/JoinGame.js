import {useEffect, useState} from 'react'
import AlertBox from './AlertBox';
import {useNavigate} from 'react-router-dom'

var roomState//needed to pass info through navigate()

function JoinGame({ socket }){
    const [username,setUser] = useState("");
    const [room,setRoom] = useState("");
    const [error, setError] = useState(false)
    const [errorTitle, setErrorTitle] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
	const navigate = useNavigate()

    useEffect(()=>{
        socket.on("user_already_in_room",e=>{
            setErrorTitle('Username is not available')
            setErrorMsg('Someone with this username is already in this room')
            setError(true)
        })
        socket.on("player_joined", e =>{
            console.log("joined room " + room)
            
			navigate('/waitingRoom', {state:{room:roomState.room, playerList:e, user:roomState.user, isAdmin:false}}) //go to waiting room
        })
        socket.on('room_does_not_exist', e=>{
            setErrorTitle('This room does not exist')
            setErrorMsg('please join an existing game or create your own')
            setError(true)
        })

      return ()=>{
        socket.off("user_already_in_room")
        socket.off("player_joined")
        socket.off("room_does_not_exist")
      }},[socket, navigate, room, username])  

        return (
            <div className="grid items-center justify-center h-screen bg-purple-300" >
                <div className='flex-initial flex-wrap'>
                    {error ? <AlertBox title={errorTitle} message={errorMsg}/> : null}
                    {/*only shows when there's an error which is set in useEffect()*/}
                    <form id="start" >
                        <input 
                            id="name" 
                            type="text"  
                            placeholder="Enter Username" 
                            className="p-3 text-2xl rounded-full grid items-center justify-center mt-2"
                            onChange= {e => {
                                setError(false)
                                setUser(e.target.value.trim())
                            }}
                        />
                        <input 
                            id="room" 
                            type="text" 
                            placeholder="Enter Room Code" 
                            className="p-3 text-2xl rounded-full mt-1 grid items-center justify-center"
                            onChange={e=>{
                                setError(false)
                                setRoom(e.target.value.trim())
                            }}
                                
                        />
                    </form>
                        
                    <button id="join" 
                    className="p-3 text-xl rounded-full mt-1 bg-green-300"
                    onClick={() => {
                        if(room === "" ||username ===""){
                            setErrorTitle('Error')
                            setErrorMsg("Cannot leave fields blank")
                            setError(true)
                            return
                        } 
                        if (room.includes(" ")){
                            setErrorTitle('Error')
                            setErrorMsg("Room code cannot include spaces")
                            setError(true)
                            return
                        }
                        socket.emit("join", {name: username, room: room})
						roomState = {room: room, user: username}
                    }}> 
                    Join Game </button>
                </div>
            </div>
        )
}

export default JoinGame;