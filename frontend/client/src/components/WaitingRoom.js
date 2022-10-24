import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import Loading from './WaitBanner'
import Card from './Card'


function WaitingRoom({ socket }) {
	const location = useLocation()
	const username = location.state.user
	const room = location.state.room
    const isAdmin = location.state.isAdmin
    const [gameIsStarted, startGame] = useState(false)
	const [players, setPlayers] = useState(location.state.playerList)

    // gameplay state stuff starts here
    const [hand, setHand] = useState([])
    const [turn, setTurn] = useState("")
    const [upcard, setUpcard] = useState({})
    const [opponentCards, setOpponentCards] = useState([])
    const [chooseSuit,setSuit] = useState(false)
    
    useEffect(()=>{
        socket.on('player_joined',e=>{
    		setPlayers(e)
        })

        socket.on("end",message=>{
            console.log(message)
        })

        socket.on("updateDisplay", data=>{
            setUpcard(data['upcard'])
            setTurn(data['turn'])
        })
        
        socket.on(username,data=>{
            setHand(data["hand"].map(e=>
                    <Card key={e["rank"]+e["suit"]}
                        user={username} 
                        rank={e["rank"]} 
                        suit={e["suit"]} 
                        room={room}
                        socket={socket}
                    />
                ))
        })

        socket.on('move_to_game_start', data =>{
    
            setHand(data['hand'].map(e=>
                <Card key={e["rank"]+e["suit"]}
                    user={username} 
                    rank={e["rank"]} 
                    suit={e["suit"]} 
                    room={room}
                    socket={socket}
                />
            ))
            setTurn(data['turn'])
            setUpcard(data['upcard'])
            setOpponentCards(data['opponents'])
            console.log("game is starting!")
            startGame(true)
        })

        socket.on("error",error=>{
            console.log(error)
        })

        socket.on("choose suit",data=>{
            if(data === true){
                console.log("make pop up box to choose suit")
                setSuit(true)
            }
        })
        
      return ()=>{
        socket.off("player_joined")
        socket.off("move_to_game_start")
      }},[socket])

    return (
        <div>
            <div >
                <div>
                {!gameIsStarted && <Loading />}
                    {!gameIsStarted && <LobbyDisplay socket={socket} players={players} isAdmin={isAdmin} room={room}/>}
                    {gameIsStarted && <div>
                        <OpponentCards opponents={opponentCards}/>
                        
                        <div className='flex items-center justify-center text-8xl text-red-500/100'>Current turn: {turn}</div>
                            <div className='container mx-auto shadow-md bg-green-300 md:max-w-xl'>
                            <UpcardDisplay card={upcard} username={username} socket={socket} room={room} turn={turn}/>
                                
                            </div>
                            {chooseSuit === true?<ChooseSuit setSuit={setSuit} user={username} room={room} socket={socket}/>:<CardHand user={username} hand={hand} room={room} socket={socket}/>}
                            
                        </div>}
                </div>
            </div>
        </div>
    )
}
// className="flex items-center justify-center h-screen text-xl bg-green-300 "
const ChooseSuit = props =>{
    const suits = ["Hearts",'Diamonds', 'Clubs',"Spades"]
    console.log("choose suit prompt,",props)
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
                <h1 style={{margin:"15px",textAlign:"center"}}>Choose Suit</h1>    
                <div className='flex flex-grow justify-center mt-5 gap-x-3'>
                    {suitButtons}
                </div>
            </div>
        </div>
    )
}

const Suit =props =>{
    
    const handleClick = () =>{
        console.log("do i not know this?",props.suit,"user",props.user,"room",props.room)
        console.log("i clicked the suit")
        props.socket.emit("choose suit",{
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

function LobbyDisplay(props)
{
    return (
    <div >
        <u>Player List</u>
        <ul>
            {props.players.map(data => (<li key={data}>{data}</li>))}
        </ul>
        {props.isAdmin && (<button 
        className="p-2 rounded-full bg-blue-400 mt-20"
        onClick={() => {
            props.socket.emit("start_game", props.room);
        }}>
        Start Game</button>)}
    </div>)
}

function CardHand(props){
    
    return (
        <div className='flex flex-grow justify-center mt-5 gap-x-3'>
            {props.hand}
        </div>
    )

}

function OpponentCards(props)
{
    //referenced https://css-tricks.com/text-blocks-over-image/ for displaying text over the card image
    
    const deckImg = <img alt="1B" src="../../cards/1B.svg" className="w-35 h-40"/>

    let handStr = []
    props.opponents.forEach(person => {
        handStr.push(<div key={person.name}>
            <p className='text-4xl flex justify-center'>{person['name']}</p>
            <div className='relative flex justify-center p-3'>
                {deckImg}
                <div className='text-8xl absolute'>{person['count']}</div>
            </div>
        </div>)
    })

    return (<div className='container mx-auto md:max-w-xl'>
        <div className='flex justify-center text-6xl'>Opponent Hands</div>
        <div className='flex flex-grow justify-center'>
            {handStr}
        </div>
    </div>)
}

function UpcardDisplay(props)
{
    const drawCard = () =>{
        if (props.turn !== props.username){
            console.log("it is not your turn",props.turn)
            return
        }
        console.log(props.username,"wawnts to draw")
        props.socket.emit("action",{
                "action":"draw",
                "player":props.username,
                "room":props.room
        })

    }

    const deckImg = (
        <div onClick={drawCard}>
            <img 
                alt="1B"
                src="../../cards/1B.svg"
                className="w-35 h-40"
            />
        </div>
    )                      
    return (
        <div>
             <p className='flex justify-center'>Current upcard:</p>
            <div className='flex items-center justify-center'>
                <Card suit={props.card.suit} rank={props.card.rank} />
                <div className='text-9xl p-3'>{deckImg}</div>
            </div>
        </div>
    )
    
}

export default WaitingRoom;