const Suit = props =>{
    
    const handleClick = () =>{
        props.socket.emit("action",{
            "action":"choose suit",
            "suit":props.suit,
            "room":props.room,
            "player":props.user
        })
        props.setSuit(false)
    }
    return (
        <button
            onClick={handleClick}
            style={{backgroundColor:"lightgreen",borderRadius:"25px",padding:"10px"}}>
            {props.suit}
        </button>
    )
}

export default Suit;