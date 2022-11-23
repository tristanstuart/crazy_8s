import {useEffect, useState} from 'react'
import CardHand from './gameplay/CardHand'
import UpcardDisplay from './gameplay/UpcardDisplay'
import ChooseSuit from './gameplay/ChooseSuit'
import CurrentSuit from './gameplay/CurrentSuit'
import PlayerLayout from './gameplay/PlayerLayout'
import LeaveGame from './gameplay/LeaveGame'
import RuleAnimation from './RuleAnimation'
import ResetGame from './gameplay/ResetGame'
import { useNavigate } from "react-router-dom"

function GameRoom({ socket }) {
	const ID = sessionStorage.getItem("session") !== null ? JSON.parse(sessionStorage.getItem("session")).ID : null
    const gameOver = sessionStorage.getItem("gameOver") !== null ? JSON.parse(sessionStorage.getItem("gameOver")) : null
    const ROOM = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")).room : null
    const DATA = sessionStorage.getItem("data") !== null ? JSON.parse(sessionStorage.getItem("data")) : null

    const username = DATA !== null ? DATA.user : null
    const isAdmin = DATA !== null ? DATA.isAdmin : null
    const players = DATA !== null ? DATA.playerList : null
    const [opponentCards, setOpponentCards] = useState(DATA.opponents)
    const [activeSuit,setActiveSuit] = useState(DATA.activeSuit)
    const [chooseSuit,setSuit] = useState(DATA.chooseSuit)
    const [upCard, setUpcard] = useState(DATA.upCard)
    const [turn, setTurn] = useState(DATA.turn)
    const [hand,setHand] = useState(DATA.hand)//used but not used? here for causing updates to DOM for re-renders, i guess
    const [warning,setWarning] = useState("")
    const [rule, setRule] = useState(null)
    const nav = useNavigate()

    //delete this
    document.title = "User: " + username
    
    useEffect(()=>{
        socket.on("move",message=>{
            sessionStorage.setItem("gameOver","false")
            const data = {
                isAdmin:DATA.isAdmin,
                inSession:false,
                playerList:DATA.playerList,
                room:DATA.room,
                user:DATA.user
            }
            sessionStorage.setItem("data",JSON.stringify(data))
            nav("/waitingRoom")
        })

    },[DATA.isAdmin, DATA.playerList, DATA.room, DATA.user, nav, socket])

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
                DATA.inSession = false
                sessionStorage.setItem("data",JSON.stringify(DATA))
                sessionStorage.setItem("gameOver",JSON.parse(true))
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

            if(data['rule']){

                // animation stops after 5 seconds 
                setTimeout(function(){
                    setRule(null);
                },5000);

                if(data['rule'] === 'draw2' && data["nextTurn"] === username){
                    console.log("draw2 event")
                    setRule('draw2')
                    socket.emit("draw",{
                        "room":ROOM,
                        ID:ID
                    })
                    socket.emit("draw",{
                        "room":ROOM,
                        ID:ID
                    })
                    
                } 
                else if(data['rule'] === 'skip'){
                    console.log('skip')
                    setRule('skip')
                    
                }
                else if(data['rule'] === 'reverse'){
                    console.log('reverse')
                    setRule('reverse')
                }
                // setTimeout();
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
        <div className='bg-poker-table bg-cover min-h-screen '>
            {isAdmin === true && gameOver === true?<ResetGame socket={socket} ID={ID} room={ROOM}/>:<div/>}          
            {rule? <RuleAnimation rule={rule} /> : <div></div>}
             <div className='flex  items-center justify-center'>
                <PlayerLayout opponents={opponentCards} players={players} iconDictionary={DATA.iconList} gameIsOver={warning.endsWith("has won!")} turn={DATA.turn}/>
            </div>
            <CurrentSuit suit={activeSuit}/>

                                   {/*hacky way of disabling player
                                    turn indicator when game ends. 
                                    add variable for this later*/}
            {(turn === username && !warning.endsWith("has won!")) && <div className="motion-safe:animate-pulse neon-text mt-2" style={{textAlign:"center",fontSize:"28px"}}>Your Turn!</div>}
            
            <div style={{textAlign:"center",color:"red",fontSize:"25px",margin:"15px"}}>
                {warning}
            </div>
             <div style={{display:"flex",justifyContent:"center",backgroundColor:"inherit",width:"fit-content",margin:"10px auto 0px auto"
            ,padding:"0px 75px 15px 75px",borderRadius:"100px"}}  >
                <UpcardDisplay 
                    card={upCard} 
                    username={username} 
                    socket={socket} 
                    ROOM={ROOM} 
                    turn={DATA.turn}
                    ID={ID}
                /> 
            </div>
             <div className=''>
                {chooseSuit === true ? 
                    <ChooseSuit 
                    setSuit={setSuit} 
                    user={username} 
                    room={ROOM} 
                    socket={socket}/>:<div/>

                }
                    <CardHand 
                        username={username} 
                        hand={DATA.hand} 
                        room={ROOM} 
                        socket={socket}
                        chooseSuit={chooseSuit}/>
                    <div className="leave-button"> 
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
                </div>
        </div>   
    )
}

export default GameRoom;