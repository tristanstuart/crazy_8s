import Card from './Card'

function CardHand(props){

    const hand = makeCards(props.username,props.room,props.socket,props.chooseSuit,props.hand)
    return (
            <div className="hand pb-5">
                {hand}
            </div>
    )   
}

// creates a list of Card components from hand data
function makeCards(username,room,socket,chooseSuit,cards){
    return cards.map( e=>
        <Card key={e["rank"]+ " " +e["suit"] }
            user={username} 
            rank={e["rank"]} 
            suit={e["suit"]} 
            room={room}
            socket={socket}
            chooseSuit={chooseSuit}
            class_={'card-select'}
        />                                 
    )
}

export default CardHand