
const LeaveGame = ({socket,room,ID,hand}) =>{
    
    const handleClick = () =>{
        console.log("you clicked leave button")
        console.log()
        socket.emit("leaveRoom",{
            "ID":ID,
            "room":room,
            "hand":hand
        })
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