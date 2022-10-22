import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'


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

        socket.on('move_to_game_start', data =>{
            console.log(JSON.stringify(data))
            setHand(data['hand'])
            setTurn(data['turn'])
            setUpcard(data['upcard'])
            setOpponentCards(data['opponents'])
            console.log("game is starting!")
            startGame(true)
        })
      return ()=>{
        socket.off("player_joined")
        socket.off("move_to_game_start")
      }},[socket])

    return (
        <div className="grid items-center justify-center h-screen text-xl bg-green-300 ">
            <div className='flex-initial flex-wrap'>
				{!gameIsStarted && <LobbyDisplay socket={socket} players={players} isAdmin={isAdmin} room={room}/>}
                {gameIsStarted && <div>
                    <CardHand hand={hand}/>
                    <div>Current turn: {turn}</div>
                    <UpcardDisplay card={upcard}/>
                    <OpponentCards opponents={opponentCards}/>
                    </div>}
            </div>
        </div>
    )
}

function LobbyDisplay(props)
{
    return (<div>
        <u>Player List</u>
        <ul>
            {props.players.map(data => (<li>{data}</li>))}
        </ul>
        {props.isAdmin && (<button 
        className="p-2 rounded-full bg-blue-400 mt-1"
        onClick={() => {
            props.socket.emit("start_game", props.room);
        }}>
        Start Game</button>)}
    </div>)
}

function CardHand(props)
{
    let handStr = ""
    props.hand.forEach(card => {
        handStr += card['rank'] + " of " + card['suit'] + ", "
    })

    return (<div>
        Hand: {handStr}
    </div>)
}

function OpponentCards(props)
{
    let handStr = ""
    props.opponents.forEach(person => {
        handStr += person['name'] + ": " + person['count'] + ", "
    })

    return (<div>
        Hand: {handStr}
    </div>)
}

function UpcardDisplay(props)
{
    console.log(JSON.stringify(props.card))
    return (<div>
        Current upcard: {props.card.rank} of {props.card.suit}
    </div>)
}

export default WaitingRoom;