import Card from "./Card"

function UpcardDisplay(props)
{
    const drawCard = () =>{
        if (props.turn !== props.username){
            return
        }
        props.socket.emit("draw",{
            "room":props.room
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
                    className='flex items-center justify-center rounded-full bg-red-400 w-20 h-7 mt-auto mb-auto'
                >
                    Draw
                </button>
            </div>
    )
}

export default UpcardDisplay