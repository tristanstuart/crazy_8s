
const LeaveGame = ({socket,room,ID,inSession,hand,user,isAdmin}) =>{
    
    const handleClick = () =>{
        console.log("you clicked leave button")
        console.log()
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
    //style={{display:"flex",justifyContent:"center",margin:"20px"}}
    return (
        <div >
            <button 
                onClick={handleClick}
                className="leave-button hover:bg-red-400 rounded-full"
                >
                Leave Game
            </button>
        </div>
    )
}

export default LeaveGame;