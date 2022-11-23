import {Navigate, useNavigate} from 'react-router-dom'
const LeaveGame = ({socket,room,ID,inSession,hand,user,isAdmin}) =>{
    
    const handleClick = () =>{
        const data = {
            "ID":ID,
            "room":room,
            "inSession":inSession,
            "user":user,
            "isAdmin":isAdmin
        }
        if(inSession){
            data.hand = hand
            socket.emit("leaveRoom",data)
            return
        }
        socket.emit("leaveRoom",data)
    }
    return (
        <div >
            <button 
                onClick={handleClick}
                className="p-4 bg-red-400 hover:bg-red-500 w-full rounded-lg shadow text-xl font-medium uppercase text-white"
                >
                Leave Game
            </button>
        </div>
    )
}

export default LeaveGame;