import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Lobby} from './Lobby'

function WaitingRoom({ socket }) {

    const ID = sessionStorage.getItem("session") !== null ? JSON.parse(sessionStorage.getItem("session")).ID : null;
    const ROOM = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")).room : null;
    const DATA = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")) : null;
    
    const navigate = useNavigate()
	const [players, setPlayers] = useState(DATA.playerList)//used but not used? here for causing updates to DOM for re-renders, i guess
    const [iconList, setIconList] = useState([])
    const username = DATA !== null ? DATA.user : null
    const isAdmin = DATA !== null ? DATA.isAdmin : null
    

    //delete this
    document.title = "User: " + username

    useEffect(()=>{

        socket.on("updateIconForPlayer", data => {
            DATA.iconList = data
            sessionStorage.setItem("data",JSON.stringify(DATA))
            setIconList(DATA.iconList)
            console.log("uifp: " + JSON.stringify(DATA.iconList))
        })

        socket.on("reJoin",e=>{
            console.log("i rejoined a room")
        })

        socket.on('player_joined',e=>{
            console.log("lpayer joinedd wile in waitingrommo")
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
        socket.off("updateIconForPlayer")
      }},[socket, navigate, username, DATA, ROOM, ID])
    return (
        <div >
            <div>
                <Lobby socket={socket} players={DATA.playerList} iconDictionary={DATA.iconList} isAdmin={isAdmin} ROOM={ROOM} ID={ID} DATA={DATA}/>
            </div>
            
        </div>
    )
}


export default WaitingRoom;