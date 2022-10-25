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
    //delete this
    document.title = "User: " + username

    useEffect(()=>{
        socket.on('player_joined',e=>{
    		setPlayers(e)
        })

        socket.on("end",message=>{
            console.log(message)
        })

        socket.on("updateDisplay", data=>{
            console.log(data)
            setUpcard(data['upcard'])
            setTurn(data['nextTurn'])
            setActiveSuit(data["activeSuit"])
        })
        
        socket.on("updateHand",data=>{
            setHand(makeCards(username,room,socket,chooseSuit,data['hand']))
        })

        socket.on('move_to_game_start', data =>{
            setHand(makeCards(username,room,socket,chooseSuit,data['hand']))
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
                            <div style={{textAlign:"center"}}>Current Turn:{turn}</div>
                            <div className='flex  items-center justify-center'>
                                <PlayerLayout opponents={opponentCards} players={players}/>
                            </div>
                            <CurrentSuit suit={activeSuit}/>
                            <div style={{display:"center",justifyContent:"center"}}>
                                <UpcardDisplay 
                                    card={upcard} 
                                    username={username} 
                                    socket={socket} 
                                    room={room} 
                                    turn={turn}/>
                                {chooseSuit === true ? 
                                    <Popup
                                        setSuit={setSuit} 
                                        user={username} 
                                        room={room} 
                                        socket={socket}
                                        hand={hand}/>
                                        :<div/>
                                }
                                <CardHand 
                                        user={username} 
                                        hand={hand} 
                                        room={room} 
                                        socket={socket}
                                        chooseSuit={chooseSuit}/>
                                
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
            <ChooseSuit 
                setSuit={props.setSuit} 
                user={props.user} 
                room={props.room} 
                socket={props.socket}/>
        </div>
    )
}

function makeCards(username,room,socket,chooseSuit,cards){
    return cards.map(e=><Card key={e["rank"]+ " " +e["suit"]}
    user={username} 
    rank={e["rank"]} 
    suit={e["suit"]} 
    room={room}
    socket={socket}
    chooseSuit={chooseSuit}
    class_={'transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-10 hover:scale-110 duration-300'}/>)
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
    <div style={{display:"grid",justifyContent:"center",gap:"5px"}}>
        
        <div style={{display:"flex",justifyContent:"center",backgroundColor:"lightgreen",width:"max-content",padding:"20px 15px 20px 15px",borderRadius:"30px"}}>
            <div style={{display:"grid",justifyContent:"center"}}>

        <u style={{textAlign:"center"}}>Player List</u>
        <ul style={{display:"grid",justifyContent:"center",gridTemplateColumns:"max-content"}}>
            {props.players.map(data => (<li style={{display:"flex",justifyContent:"center"}}key={data}>{data}</li>))}
        </ul>
        
        
        </div>

    </div>
    {props.isAdmin && (<button 
        className="p-2 rounded-full bg-blue-400"
        onClick={() => {
            props.socket.emit("start_game", props.room);
        }}>
        Start Game</button>)}

    </div>
    
    )
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
            return
        }
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