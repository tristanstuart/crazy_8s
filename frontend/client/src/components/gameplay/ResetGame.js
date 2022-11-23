const ResetGame = ({socket,ID,room}) =>{
    
    const clickedYes = () =>{
        socket.emit("restartGame",{
            "ID":ID,
            "room":room,
        })
    }
    const clickedNo = () => {
        socket.emit("closeGame",{
            "ID":ID,
            "room":room
        })        
    }

    return (
        <div style={{display:"flex",justifyContent:"center",padding:"20px"}}>
            <div style={{borderRadius:"15px",padding:"10px",backgroundColor: "rgb(96 165 250)"}}>
                Would you like to restart the game?
                <div style={{display:"grid",justifyContent:"center",gap:"15px",gridTemplateColumns:"max-content max-content"}}>
                    <button onClick={clickedYes} style={{borderRadius:"15px",padding:"10px",backgroundColor:"lightgreen"}}>Yes</button>
                    <button onClick={clickedNo} style={{borderRadius:"15px",padding:"10px",backgroundColor:"lightcoral"}}>No</button>
                </div>
            </div>
        </div>
    )
}

export default ResetGame;