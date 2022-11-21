import Card from './Card'

function CardHand(props){
   const hand = makeCards(props.socket, props.room, props.hand)
    return (
        <div className="flex space-x-2 items-center justify-center">
            {hand}
        </div>
    ) 
}

// creates a list of Card components from hand data
function makeCards(socket, room, cards){
    return cards.map( e=>
        <Card 
            rank={e["rank"]} 
            suit={e["suit"]} 
            room={room}
            socket={socket}
            class_={'relative flex transition-all transform-gpu rounded-lg shadow-2xl cursor-pointer hover:-mt-20'}
        />
    )
}

export default CardHand