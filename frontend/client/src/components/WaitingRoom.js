import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import Loading from './WaitBanner'
import {useNavigate} from 'react-router-dom'

function WaitingRoom({ socket }) {
	const location = useLocation()
	const username = location.state.user
	const room = location.state.room
    const isAdmin = location.state.isAdmin
	const [players, setPlayers] = useState(location.state.playerList)
	const navigate = useNavigate()

    useEffect(()=>{
        socket.on('player_joined',e=>{
    		setPlayers(e)
        })

        socket.on('move_to_game_start', data =>{
            console.log("swapping to gameroom")
            navigate('/gameRoom', {state:{room:room, playerList:players, user:username, isAdmin:isAdmin, data:data}}) //go to waiting room
        })
      return ()=>{
        socket.off("player_joined")
        socket.off("move_to_game_start")
      }},[socket,room, username, isAdmin, navigate, players])
    return (
        <div >
            <div >
                <div>
                <Loading />
                <LobbyDisplay socket={socket} players={players} isAdmin={isAdmin} room={room}/>
                </div>
            </div>
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
                    {props.players.map(data => 
                        (<li style={{display:"flex",justifyContent:"center"}}key={data}>{data}</li>)
                    )}
                </ul>
            </div>
        </div>{
        props.isAdmin && (
            <button 
                className="p-2 rounded-full bg-blue-400"
                onClick={() => {
                    props.socket.emit("start_game", props.room)
                }}>
            Start Game
            </button>)
        }
    </div>
    )
}

export default WaitingRoom;