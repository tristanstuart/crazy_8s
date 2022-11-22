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
        socket.on("player_joined", e =>{
            const data = {
                room : roomState.room,
                inSession : false,
                isAdmin : false,
                user : roomState.user,
                playerList : e
            }
            sessionStorage.setItem("data",JSON.stringify(data))
			navigate('/waitingRoom') //go to waiting room
        })
        socket.on("error",data=>{
            setErrorTitle(data.title)
            setErrorMsg(data.message)
            setError(true)
        })

      return ()=>{
      }},[socket, navigate, room, username])  

        return (
            <div className="grid items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500 " >
                <div className='flex-initial flex-wrap'>
                    {error ? <AlertBox title={errorTitle} message={errorMsg}/> : null}
                    {/*only shows when there's an error which is set in useEffect()*/}
                    <form id="start" >
                        <input 
                            id="name" 
                            type="text"  
                            placeholder="Enter Username" 
                            className="p-3 text-2xl rounded-full grid items-center justify-center mt-2 "
                            onChange= {e => {
                                setError(false)
                                setUser(e.target.value.trim())
                            }}
                        />
                        <input 
                            id="room" 
                            type="text" 
                            placeholder="Enter Room Code" 
                            className="p-3 text-2xl rounded-full mt-1 grid items-center justify-center "
                            onChange={e=>{
                                setError(false)
                                setRoom(e.target.value.trim())
                            }}
                                
                        />
                    </form>
                        
                    <button id="join" 
                    className="p-3 text-xl rounded-full mt-1 bg-green-300 "
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
                        socket.emit("join", {name: username, room: room,ID:JSON.parse(sessionStorage.getItem("session")).ID})
						roomState = {room: room, user: username}
                    }}> 
                    Join Game </button>
                </div>
            </div>
        )
}

export default JoinGame;