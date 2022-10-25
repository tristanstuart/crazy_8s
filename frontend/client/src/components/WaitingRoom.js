import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import Loading from './WaitBanner'
import Card from './Card'
import ChooseSuit from './ChooseSuit'
import PlayerLayout from './PlayerLayout'

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
    const [activeSuit,setActiveSuit] = useState("")

    useEffect(()=>{
        socket.on('player_joined',e=>{
    		setPlayers(e)
        })

        socket.on("end",message=>{
            console.log(message)
        })

        socket.on("updateDisplay", data=>{
            console.log("updateDisplay",JSON.stringify(data,null,2))
            setUpcard(data['upcard'])
            setTurn(data['turn'])
            setActiveSuit(data["activeSuit"])
        })
        
        socket.on(username,data=>{
            setHand(data["hand"].map(e=>
                    <Card key={e["rank"]+" "+e["suit"]}
                        user={username} 
                        rank={e["rank"]} 
                        suit={e["suit"]} 
                        room={room}
                        socket={socket}
                        class_={'transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-10 hover:scale-110 duration-300'}
                    />
                ))
        })

        socket.on('move_to_game_start', data =>{
            setHand(data['hand'].map(e=>
                <Card key={e["rank"]+ " " +e["suit"]}
                    user={username} 
                    rank={e["rank"]} 
                    suit={e["suit"]} 
                    room={room}
                    socket={socket}
                    class_={'transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-10 hover:scale-110 duration-300'}
                />
            ))
            setTurn(data['turn'])
            setUpcard(data['upcard'])
            setOpponentCards(data['opponents'])
            setActiveSuit(data["upcard"]["suit"])
            startGame(true)
        })

        socket.on("error",error=>{
            console.log(error)
        })

        socket.on("choose suit",data=>{
            if(data === true){
                setSuit(true)
            }
        })

        socket.on("status",status=>{
            console.log(JSON.stringify(status,null, 2))
        })
        
      return ()=>{
        socket.off("player_joined")
        socket.off("move_to_game_start")
      }},[socket,room, username])
    return (
        <div>
            <div >
                <div>
                {!gameIsStarted && <Loading />}
                    {!gameIsStarted && <LobbyDisplay socket={socket} players={players} isAdmin={isAdmin} room={room}/>}
                    {gameIsStarted && 
                        <div className='bg-purple-200'>
                            <div className='flex  items-center justify-center'>
                                <PlayerLayout opponents={opponentCards} players={players}/>
                            </div>
                            {/* <div className='flex items-center justify-center text-8xl text-red-500/100'>
                                Current turn: {turn}
                            </div> */}
                            
                            <div className='container mx-auto shadow-md bg-green-300 rounded-full w-1/2'>
                                <UpcardDisplay 
                                    card={upcard} 
                                    username={username} 
                                    socket={socket} 
                                    room={room} 
                                    turn={turn}/>
                                {chooseSuit === true ? 
                                    <ChooseSuit 
                                        setSuit={setSuit} 
                                        user={username} 
                                        room={room} 
                                        socket={socket}/>
                                        :
                                    <CardHand 
                                        user={username} 
                                        hand={hand} 
                                        room={room} 
                                        socket={socket}/>
                                }
                            </div>
                            
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
const Popup = props =>{

    return(
        <div style={{display:"grid",justifyContent:"center",gridTemplateColumns:"auto auto",gap:"15px",padding:"15px"}}>
            <ChooseSuit setSuit={props.setSuit} user={props.username} room={props.room} socket={props.socket}/>
            <MiniCards hand={props.hand}/>
        </div>
    )
}

const MiniCards = hand =>{
    console.log(hand)
    return(
        <div style={{padding:"30px"}}>
            <span style={{display:"flex",justifyContent:"center"}}>Hey cards go here</span>
        </div>
    )
}

const CurrentSuit = props =>{    
    return(
        <div style={{display:"flex",justifyContent:"center"}}>
            Active Suit: {props.suit}
        </div>
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
            {props.hand }
        </div>
    )
    
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
            <div className='flex items-center justify-center '>
                <Card  suit={props.card.suit} rank={props.card.rank} class_='' />
                <div className='text-9xl p-3'>{deckImg}</div>
            </div>
        </div>
    )
    
}

export default WaitingRoom;