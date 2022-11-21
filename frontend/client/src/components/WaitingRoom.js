import {useEffect, useState} from 'react'
import Loading from './WaitBanner'
import {useNavigate} from 'react-router-dom'
import LeaveGame from './gameplay/LeaveGame'

function WaitingRoom({ socket }) {

    const ID = sessionStorage.getItem("session") !== null ? JSON.parse(sessionStorage.getItem("session")).ID : null;
    const ROOM = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")).room : null;
    const DATA = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")) : null;
    
    const navigate = useNavigate()
	const [players, setPlayers] = useState(DATA.playerList)
    const username = DATA !== null ? DATA.user : null
    const isAdmin = DATA !== null ? DATA.isAdmin : null

    //delete this
    document.title = "User: " + username

    useEffect(()=>{

        socket.on("reJoin",e=>{
            console.log("i rejoined a room")
        })

        socket.on('player_joined',e=>{
            DATA.playerList = e
            sessionStorage.setItem("data",JSON.stringify(DATA))
            setPlayers(DATA.playerList)
        })

        socket.on('move_to_game_start', data =>{
            console.log("gameStart",data)
            
            DATA.inSession = true
            DATA.hand = data["hand"]
            DATA.upCard = data["upCard"]
            DATA.activeSuit = data["upCard"]["suit"]
            DATA.turn = data["turn"]
            DATA.opponents = data["opponents"]
            DATA.chooseSuit = false
            //DATA.playerList should already be current since its updated every socket.on('player_joined')
            sessionStorage.setItem("data",JSON.stringify(DATA))

            navigate("/gameRoom")
        })

        socket.on("newAdmin",data=>{
            DATA.isAdmin = true
            sessionStorage.setItem("data",JSON.stringify(DATA))
        })

        //uncomment to display status
        socket.on("status",status=>{
            console.log(JSON.stringify(status,null, 2))
        })
        
      return ()=>{
        socket.off("player_joined")
        socket.off("reJoin")
        socket.off("move_to_game_start")
        socket.off("newAdmin")
        socket.off("status")
      }},[socket, navigate, username, DATA, ROOM, ID])
    return (
        <div >
            <div>
                <Loading />
                <LobbyDisplay socket={socket} players={DATA.playerList} isAdmin={isAdmin} ROOM={ROOM} ID={ID}/>
            </div>
            <br></br>
            <LeaveGame 
                socket={socket} 
                room={ROOM} 
                ID={ID} 
                inSession={DATA.inSession} 
                hand={DATA.hand}
                user={DATA.user}
                isAdmin={isAdmin}
                />
        </div>
    )
}

function LobbyDisplay(props)
{
    //params(socket={socket} players={DATA.playerList} isAdmin={isAdmin} ROOM={ROOM} ID={ID})
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

                    props.socket.emit("start_game", {
                        room:props.ROOM,
                        ID:props.ID
                    })
                }}>
            Start Game
            </button>)
        }
    </div>
    )
}

export default WaitingRoom;