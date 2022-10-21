import {useState} from 'react'
//assuming card svg's are stored in public/cards
//takes in a string named type that declares the type of Card
//Ex AD - Ace of Diamonds etc.
const Card = (props) =>{
    //gives errors, too many renders?
    // const [rank,setRank] = useState("");
    // const [suit,setSuit] = useState('')
    // setRank(props.type[0])
    // setSuit(props.type[1])
    return (
        <div id={props.type} >
            <img src={`/cards/${props.type}.svg`} style={{width:'100px'}}/>
        </div>
    )
}

export default Card;