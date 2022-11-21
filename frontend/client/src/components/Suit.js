const Suit = props =>{
    
    const handleClick = () =>{
        props.socket.emit("setSuit",{
            "suit":props.suit,
            "room":props.room,
            ID:JSON.parse(sessionStorage.getItem("session")).ID
        })
        const DATA = JSON.parse(sessionStorage.getItem("data"))
        DATA.chooseSuit = false
        sessionStorage.setItem("data",JSON.stringify(DATA))
        props.setSuit(DATA.chooseSuit)
    }
    return (
        <button
            onClick={handleClick}
            style={{backgroundColor:"white",borderRadius:"50%",padding:"10px"}}>
            <img style={{width:"30px"}} alt={props.suit} src={`/suits/${props.suit}.svg`}/>
        </button>
    )
}

export default Suit;