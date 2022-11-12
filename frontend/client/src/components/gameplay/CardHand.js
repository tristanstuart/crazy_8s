import Card from './Card'

function CardHand(props){
    return (
        // <div className='flex flex-wrap justify-center mt-5 gap-x-3'>
        <div className="flex space-x-2 items-center justify-center">
            {props.hand }
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

export {CardHand, makeCards};