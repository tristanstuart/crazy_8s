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
    
    useEffect(()=>{
        socket.on('player_joined',e=>{
    		setPlayers(e)
			console.log("player joined " + e)
        })

        socket.on("updateDisplay", data=>{
            console.log(data)
            setUpcard(data['upcard'])
            setTurn(data['turn'])
        })
        
        socket.on(username,data=>{
            console.log("data in cards")
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
            console.log(JSON.stringify(data))
            console.log(data)
            
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
            if(data){
                console.log("make pop up box to choose suit")
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
                                <UpcardDisplay card={upcard} username={username} socket={socket} room={room}/>
                            </div>
                            <CardHand user={username} hand={hand} room={room} socket={socket}/>
                        </div>}
                </div>
            </div>
        </div>
    )
}
// className="flex items-center justify-center h-screen text-xl bg-green-300 "
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

    console.log("props in cardhand",props)
    
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
    
    console.log(props)

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
    console.log(JSON.stringify(props.card))

    const drawCard = () =>{
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