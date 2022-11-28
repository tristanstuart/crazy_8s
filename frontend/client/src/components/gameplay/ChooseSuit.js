import Suit from "./Suit"
const ChooseSuit = props =>{
    const suits = ["Hearts",'Diamonds', 'Clubs',"Spades"]
    const suitButtons = suits.map(suit=>
            <Suit
                key={suit}
                suit={suit}
                user={props.user}
                room={props.room}
                socket={props.socket}
                setSuit={props.setSuit}
                />
        )
    return (
        <div style={{display:"flex",justifyContent:"center"}}>
            <div style={{width:"fit-content",backgroundColor:"lightblue",padding:"15px",borderRadius:"30px"}}>
                <h1 style={{margin:"15px",textAlign:"center"}}>Choose a Suit</h1>    
                <div className='flex flex-grow justify-center mt-5 gap-x-3'>
                    {suitButtons}
                </div>
            </div>
        </div>
    )
}

export default ChooseSuit;