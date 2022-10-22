import {useState} from 'react'
//assuming card svg's are stored in public/cards
//takes in a string named type that declares the type of Card
//Ex AD - Ace of Diamonds etc.

const Card = (props) =>{
    
    const player = props.player
    const socket=props.socket
    const type = props.type
    const [chooseSuit,setSuit] = useState(false)
    
    //make the pop up box somewhere else
    const ChooseSuit = val =>{
        if(val){
            document.getElementById("holder").innerHTML = "make choose suit box"
        }
        else
            document.getElementById("holder").innerHTML = ""
        }
    
    const checkCard = () =>{
        console.log(props)
        if(type[0] === "8"){
            console.log("its an eight card,finish checkcard")
            setSuit(true)
            console.log(chooseSuit)
            return
        }
        else if(type.slice(-1) === props.suit){
            console.log("its a matching suit")
            setSuit(false)
            dealCard()
            return
        }
        else if(type[0] === props.upCard[0]){
            console.log("its a matching rank")
            dealCard()
            setSuit(false)
            return
        }
        setSuit(false)

        console.log("its not a match")
    }

    //finish this for if the card is an 8
    //make pop up box to choose suit
    const dealCard = () =>{
        socket.emit("action",{
                    "gameroom":props.gameroom,
                    "username":props.player,
                    "action":"deal",
                    "card":type,
            })  
    }

    return (
        
        <div id={props.type} 
            onClick={checkCard} 
            style={{display:'grid',justifyContent:'center'}}
            className="card">
            {ChooseSuit(chooseSuit)}
            {type !== null?
                <img alt={props.type} src={`/cards/${props.type}.svg`} style={{width:'120px'}} />
            :<div/>
            }
            
        </div>
    )
}


export default Card;