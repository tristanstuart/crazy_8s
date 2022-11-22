import Card from "./Card"

function UpcardDisplay(props)
{
    //params: card={upCard} username={username} socket={socket} ROOM={ROOM} turn={DATA.turn} ID={ID}
    const drawCard = () =>{
        if (props.turn !== props.username){
            return
        }
        props.socket.emit("draw",{
            room:props.ROOM,
            ID:props.ID
        })
    }

    const deckImg = (
        <img 
            alt="1B"
            src="../../cards/1B.svg"
            width="120px"
        /> 
    )                      
    return (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,max-content)",gap:"10px"}}>
                <Card suit={props.card.suit} rank={props.card.rank} />
                <div>{deckImg}</div>
                <button 
                    onClick={drawCard}
                    className='flex items-center justify-center text-white font-bold rounded-full py-2 px-4 bg-blue-400 w-20 h-7 ml-5 mt-auto mb-auto hover:bg-red-600'
                >
                    Draw
                </button>
            </div>
    )
    
}

export default UpcardDisplay