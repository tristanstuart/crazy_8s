import {useEffect, useState} from 'react'
//import {useLocation} from 'react-router-dom'
import CardHand from './gameplay/CardHand'
import UpcardDisplay from './gameplay/UpcardDisplay'
import ChooseSuit from './gameplay/ChooseSuit'
import CurrentSuit from './gameplay/CurrentSuit'
import PlayerLayout from './gameplay/PlayerLayout'
import LeaveGame from './gameplay/LeaveGame'

function GameRoom({ socket }) {
    console.log("in game room")
	const ID = sessionStorage.getItem("session") !== null ? JSON.parse(sessionStorage.getItem("session")).ID : null
    const ROOM = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")).room : null
    const DATA = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")) : null
    //const location = useLocation()

    const username = DATA !== null ? DATA.user : null
    const isAdmin = DATA !== null ? DATA.isAdmin : null
    const players = DATA !== null ? DATA.playerList : null
    const [opponentCards, setOpponentCards] = useState(DATA.opponents)
    const [activeSuit,setActiveSuit] = useState(DATA.activeSuit)
    const [chooseSuit,setSuit] = useState(DATA.chooseSuit)
    const [upCard, setUpcard] = useState(DATA.upCard)
    const [turn, setTurn] = useState(DATA.turn)
    const [hand,setHand] = useState(DATA.hand)
    const [warning,setWarning] = useState("")
    //const [loadedData,setLoadedData] = useState(false)

    //fill in data brought over from waiting room
    //probably not the best solution, may change when refactoring backend
    /*if(!loadedData)
    {
        var data = location.state.data
        setHand(makeCards(socket,room,data['hand'])) //moved makeCards to /gameplay/CardHand.js
        setTurn(data['turn'])
        setUpcard(data['upcard'])
        setOpponentCards(data['opponents'])
        setActiveSuit(data["upcard"]["suit"])
        setLoadedData(true)
    }*/

    //delete this
    document.title = "User: " + username

    useEffect(()=>{
        socket.on("reJoin",e=>{
            console.log("i rejoined a room")
        })

        socket.on("override",data=>{
            DATA.turn = data["nextTurn"]
            sessionStorage.setItem("data",JSON.stringify(DATA))
            setTurn(DATA.turn)
        })

        socket.on("updateDisplay", data=>{
            setWarning("")
            if(data["winner"] !== ""){
                setWarning(data["winner"] + " has won!")
            }
            console.log("updateDisplay",data)
            DATA.upCard = data["upCard"]
            DATA.turn = data["nextTurn"]
            DATA.activeSuit = data["activeSuit"]
            
            sessionStorage.setItem("data",JSON.stringify(DATA))
            
            setTurn(DATA.turn)
            setUpcard(DATA.upCard)
            setActiveSuit(DATA.activeSuit)

            if(data['rule'] === 'draw2'){
                socket.emit("draw",{
                    "room":ROOM,
                    ID:ID
                })
                socket.emit("draw",{
                    "room":ROOM,
                    ID:ID
                })
            }  
        })
        
        socket.on("updateHand",data=>{
            setWarning("")
            DATA.hand = data["hand"]
            sessionStorage.setItem("data",JSON.stringify(DATA))
            setHand(DATA.hand)
        })
        
        socket.on("updateOpponents",data=>{
            DATA.opponents = data["opponents"]
            sessionStorage.setItem("data",JSON.stringify(DATA))
            setOpponentCards(DATA.opponents)
        })
        
        socket.on("newAdmin",data=>{
            DATA.isAdmin = true
            sessionStorage.setItem("data",JSON.stringify(DATA))
        })

        socket.on("error",error=>{
            setWarning(error)
        })

        socket.on("choose suit",data=>{
            if(data === true){
                DATA.chooseSuit = data
                sessionStorage.setItem("data",JSON.stringify(DATA))
                setSuit(DATA.chooseSuit)
            }
        })

        //uncomment to display status
        socket.on("status",status=>{
            console.log(JSON.stringify(status,null, 2))
        })
        
      return ()=>{
        socket.off("reJoin")
        socket.off("override")
        socket.off("updateDisplay")
        socket.off("updateHand")
        socket.off("updateOpponents")
        socket.off("newAdmin")
        socket.off("error")
        socket.off("choose suit")
      }},[socket, DATA, ID, ROOM, username, chooseSuit])
    return (
        <div className='bg-purple-200 h-screen '>          
            <div className='flex  items-center justify-center'>
                <PlayerLayout opponents={opponentCards} players={players} turn={DATA.turn}/>
            </div>
            <CurrentSuit suit={activeSuit}/>
            {turn === username && <div className="animate-bounce" style={{textAlign:"center",color:"green",fontSize:"28px"}}>Your Turn!</div>}
            
            <div style={{textAlign:"center",color:"red",fontSize:"25px",margin:"15px"}}>
                {warning}
            </div>
            <div style={{display:"flex",justifyContent:"center",backgroundColor:"lightgreen",width:"fit-content",
                            margin:"10px auto 10px auto",padding:"15px 75px 15px 75px",borderRadius:"100px"}}>
                <UpcardDisplay 
                    card={upCard} 
                    username={username} 
                    socket={socket} 
                    ROOM={ROOM} 
                    turn={DATA.turn}
                    ID={ID}
                /> 
            </div>
            <div className='bg-purple-200 h-full'>
                {chooseSuit === true ? 
                    <ChooseSuit 
                    setSuit={setSuit} 
                    user={username} 
                    room={ROOM} 
                    socket={socket}
                    /> : <div/>
                }
                <CardHand 
                    hand={DATA.hand} 
                    room={ROOM} 
                    socket={socket}
                />
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

export default GameRoom;