import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {CardHand, makeCards} from './gameplay/CardHand'
import UpcardDisplay from './gameplay/UpcardDisplay'
import ChooseSuit from './gameplay/ChooseSuit'
import CurrentSuit from './gameplay/CurrentSuit'
import PlayerLayout from './gameplay/PlayerLayout'

function GameRoom({ socket }) {
    console.log("in game room")
	const location = useLocation()
	const username = location.state.user
	const room = location.state.room
    const isAdmin = location.state.isAdmin //not sure if we might need this for restarting the game so i'm leaving it in for now
	const players =location.state.playerList

    // gameplay state stuff starts here
    const [chooseSuit,setSuit] = useState(false)
    const [hand, setHand] = useState([])
    const [turn, setTurn] = useState("")
    const [upcard, setUpcard] = useState({})
    const [opponentCards, setOpponentCards] = useState([])
    const [activeSuit,setActiveSuit] = useState("")
    const [warning,setWarning] = useState("")
    const [loadedData,setLoadedData] = useState(false)

    //fill in data brought over from waiting room
    //probably not the best solution, may change when refactoring backend
    if(!loadedData)
    {
        var data = location.state.data
        setHand(makeCards(socket,room,data['hand'])) //moved makeCards to /gameplay/CardHand.js
        setTurn(data['turn'])
        setUpcard(data['upcard'])
        setOpponentCards(data['opponents'])
        setActiveSuit(data["upcard"]["suit"])
        setLoadedData(true)
    }

    //delete this
    document.title = "User: " + username

    useEffect(()=>{

        socket.on("updateDisplay", data=>{
            if(data["winner"] !== ""){
                setWarning(data["winner"] + " has won!")
            }
            setUpcard(data['upcard'])
            setTurn(data['nextTurn'])
            setActiveSuit(data["activeSuit"])
            if(data['rule'] === 'draw2'){
                socket.emit("draw",{"room":room})
                socket.emit("draw",{"room":room}) 
            }
        })
        
        socket.on("updateHand",data=>{
            setWarning("")
            setHand(makeCards(socket, room,data['hand'])) //moved makeCards to /gameplay/CardHand.js
            
        })
        
        socket.on("updateOpponents",data=>{
            setOpponentCards(data['opponents'])
        })

        socket.on("error",error=>{
            console.log(error)
            setWarning(error)
        })

        socket.on("choose suit",data=>{
            if(data === true){
                setSuit(true)
            }
        })

        //uncomment to display status
        socket.on("status",status=>{
            console.log(JSON.stringify(status,null, 2))
        })
        
      return ()=>{
        socket.off("updateDisplay")
        socket.off("updateHand")
        socket.off("updateOpponents")
        socket.off("error")
        socket.off("choose suit")
      }},[socket,room, username, chooseSuit])
    return (
        <div className='bg-purple-200 h-screen '>
            <div className='flex  items-center justify-center'>
                <PlayerLayout opponents={opponentCards} players={players} turn={turn}/>
            </div>
            <CurrentSuit suit={activeSuit}/>
            {turn === username && <div className="animate-bounce" style={{textAlign:"center",color:"green",fontSize:"28px"}}>Your Turn!</div>}
            {/*turn !== username && <div style={{textAlign:"center"}}>Current Turn: {turn}</div>*/}
            <div style={{textAlign:"center",color:"red",fontSize:"25px",margin:"15px"}}>
                {warning}
            </div>
            {/* style={{ display:"center",justifyContent:"center" }} */}
            {/* className='container shadow-md bg-green-300 rounded-full w-1/2 py-1' */}
                <div style={{display:"flex",justifyContent:"center",backgroundColor:"lightgreen",width:"fit-content",margin:"10px auto 10px auto"
                ,padding:"15px 75px 15px 75px",borderRadius:"100px"}}  >
                    <UpcardDisplay 
                        card={upcard} 
                        username={username} 
                        socket={socket} 
                        room={room} 
                        turn={turn}/> 
                </div>


            <div className='bg-purple-200 h-full'>
                {chooseSuit === true ? 
                    <ChooseSuit 
                    setSuit={setSuit} 
                    user={username} 
                    room={room} 
                    socket={socket}/>:<div/>

                }
                <CardHand 
                    user={username} 
                    hand={hand} 
                    room={room} 
                    socket={socket}
                    chooseSuit={chooseSuit}/>
            
            </div>
        </div>
    )
}

export default GameRoom;