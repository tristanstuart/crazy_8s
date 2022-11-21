
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

    return (
        <div style={{display:"flex",justifyContent:"center",margin:"20px"}}>
            <button 
                onClick={handleClick}
                style={{
                    backgroundColor:"#b9c0ea",
                    padding:"10px",
                    borderRadius:"30px"
                }}>
                Leave Game
            </button>
        </div>
    )
}

export default LeaveGame;