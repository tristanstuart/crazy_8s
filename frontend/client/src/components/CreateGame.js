import {useEffect, useState} from 'react'
import AlertBox from './AlertBox';
import {useNavigate} from 'react-router-dom'

function CreateGame({ socket }){
    const [username,setUser] = useState("")
    const [room,setRoom] = useState("")
    const [error, setError] = useState(false)
	const navigate = useNavigate()

    useEffect(()=>{
        socket.on("create",e=>{
            if (e === false) {
                console.log('room taken')
                setError(true)
            }
            else {
                
                const DATA = JSON.parse(sessionStorage.getItem("data"))
                //clears out prev gameData in sessionStorage
                const data = {
                    user:DATA.user,
                    playerList:[DATA.user],
                    room:DATA.room,
                    isAdmin:true,
                    inSession:false
                }
        
                console.log('room created')
                sessionStorage.setItem("data",JSON.stringify(data))
				navigate('/waitingRoom') //go to waiting room
            
            }
        })
      return ()=>{
        socket.off("create")
      }},[socket, navigate,room]) 

    const handleChange = (e) =>{
        setRoom(e.target.value.trim());
        setError(false);
        return
      }

    return (
        <div className="grid items-center justify-center h-screen text-xl bg-green-300 ">
            <div className='flex-initial flex-wrap'>
                {error ? <AlertBox title={room + " is not available"} message="Please choose another room name"/> : null}
                {/* only shows when error is set, happens in useEffect() */}
                <form id="start">
                    <input 
                        type="text" 
                        id="user" 
                        placeholder="User Name" 
                        className="p-3 text-2xl rounded-full grid items-center justify-center mt-2" 
                        onChange= {e => {
                            setError(false)  
                            setUser(e.target.value.trim())
                        }}
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

                        if (username==="" || room ===""){
                            setError(true)
                            console.log("cannot leave fields blank")
                            return
                        }
                        if (room.includes(" ")){
                            setError(true)
                            console.log("Room name cannot include spaces")
                            return                       
                        }

                        if(JSON.parse(sessionStorage.getItem("data")) == null){
                            
                            socket.emit("create", {
                                "username":username, 
                                "room":room,
                                ID:JSON.parse(sessionStorage.getItem("session")).ID
                            })
                            const data = {
                                room:room,
                                user:username
                            }
                            sessionStorage.setItem("data",JSON.stringify(data))
                            
                            return
                        }
                        
                        const data = JSON.parse(sessionStorage.getItem("data"))
                        socket.emit("create", {
                            "username":username, 
                            "room":room,
                            "oldRoom":data.room,
                            ID:JSON.parse(sessionStorage.getItem("session")).ID
                        })
                        data.room = room
                        data.user = username
                        sessionStorage.setItem("data",JSON.stringify(data))                
						
                    }}>
                    Create Game </button>
            </div>
        </div>
    )
}

export default CreateGame;