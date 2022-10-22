import {useEffect, useState} from 'react'
import AlertBox from './AlertBox';
import {useNavigate} from 'react-router-dom'

var roomState //needed to pass info through navigate()

function CreateGame({ socket }){
    const [username,setUser] = useState("");
    const [room,setRoom] = useState("");
    const [error, setError] = useState(false)
	const navigate = useNavigate()

    useEffect(()=>{
        socket.on("create",e=>{
            if (e === false) {
                console.log('room taken')
                setError(true)
            }
            else {
                console.log('room created')
				navigate('/waitingRoom', {state:{room:roomState.room, playerList:[roomState.user], user:roomState.user, isAdmin:true}}) //go to waiting room
            }
        })
      return ()=>{
        socket.off("create")
      }},[socket]) 

    const handleChange = (e) =>{
        setRoom(e.target.value);
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
						roomState = {room: room, user: username}
                    }}>
                    Create Game </button>
            </div>
        </div>
    )
}

export default CreateGame;