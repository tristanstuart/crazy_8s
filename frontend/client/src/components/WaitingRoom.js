import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import Loading from './WaitBanner'
import Card from './Card'


function WaitingRoom({ socket }) {
	const location = useLocation()
	// const username = location.state.user
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
        <div>
            <div >
                <div>
                {!gameIsStarted && <Loading />}
                    {!gameIsStarted && <LobbyDisplay socket={socket} players={players} isAdmin={isAdmin} room={room}/>}
                    {gameIsStarted && <div>
                        <div className='flex items-center justify-center text-8xl text-red-500/100'>Current turn-{turn}</div>
                            <div className='container mx-auto shadow-md bg-green-300 md:max-w-xl'>
                                <UpcardDisplay card={upcard}/>
                            </div>
                            <CardHand hand={hand}/>
                            <OpponentCards opponents={opponentCards}/>
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
            {props.players.map(data => (<li>{data}</li>))}
        </ul>
        {props.isAdmin && (<button 
        className="p-2 rounded-full bg-blue-400 mt-20"
        onClick={() => {
            props.socket.emit("start_game", props.room);
        }}>
        Start Game</button>)}
    </div>)
}

function CardHand(props)
{
    let playerHand = []
        props.hand.forEach(card => {
            playerHand.push(<Card rank={card['rank']} suit={card['suit']} key={card['rank']+ card['suit']} />)
        })
    return (
        <div className='flex flex-grow justify-center mt-5'>
            {playerHand}
        </div>
    )

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
    const deckImg = <img 
                      src="../../cards/1B.svg"
                      className="w-35 h-40"
                    />                      
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