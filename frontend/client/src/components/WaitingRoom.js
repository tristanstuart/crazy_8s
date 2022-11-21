import {useEffect, useState} from 'react'
import Card from './Card'
import ChooseSuit from './ChooseSuit'
import PlayerLayout from './PlayerLayout'
import LeaveGame from './LeaveGame'
import Lobby from './Lobby'

function WaitingRoom({ socket }) {

    const ID = sessionStorage.getItem("session") !== null?JSON.parse(sessionStorage.getItem("session")).ID:null;
    const ROOM = sessionStorage.getItem("data") !== null?JSON.parse(sessionStorage.getItem("data")).room:null;
    const DATA = sessionStorage.getItem("data") !== null?JSON.parse(sessionStorage.getItem("data")):null;
    
    
    const [opponentCards, setOpponentCards] = useState(DATA.opponents)
    const [activeSuit,setActiveSuit] = useState(DATA.activeSuit)
    const [gameIsStarted, startGame] = useState(DATA.inSession)
	const [players, setPlayers] = useState(DATA.playerList)
    const [chooseSuit,setSuit] = useState(DATA.chooseSuit)
    const [upCard, setUpcard] = useState(DATA.upCard)
    const [turn, setTurn] = useState(DATA.turn)
    const [hand,setHand] = useState(DATA.hand)
    const [warning,setWarning] = useState("");

    const username = DATA !== null?DATA.user:null;
    const isAdmin = DATA !== null?DATA.isAdmin:null;

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

        //work on this
        socket.on("winner",e=>{
            console.log(e)
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
            else if(data['rule'] === 'skip'){
                console.log('skip')
            }
            else if(data['rule'] === 'reverse'){
                console.log('reverse')
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

        socket.on('move_to_game_start', data =>{
            DATA.inSession = true
            DATA.hand = data["hand"]
            DATA.upCard = data["upCard"]
            DATA.activeSuit = data["upCard"]["suit"]
            DATA.turn = data["turn"]
            DATA.opponents = data["opponents"]
            DATA.chooseSuit = false
        
            sessionStorage.setItem("data",JSON.stringify(DATA))
            setActiveSuit(DATA.activeSuit)
            setTurn(DATA.turn)
            setUpcard(DATA.upCard)
            setOpponentCards(DATA.opponents)
            startGame(DATA.inSession)
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
        socket.off("player_joined")
        socket.off("updateDisplay")
        socket.off("updateHand")
        socket.off("updateOpponents")
        socket.off("error")
        socket.off("choose suit")
      }},[socket, username, chooseSuit, DATA, ROOM, ID])
    return (
        <div className='min-h-screen' >
            <div >
                <div>
                {/* {!gameIsStarted && <br/ >} */}
                    {!gameIsStarted && <Lobby socket={socket} players={DATA.playerList} isAdmin={isAdmin} ROOM={ROOM} ID={ID} DATA={DATA}/>}
                    {gameIsStarted && 
                        <div className='bg-poker-table bg-cover min-h-screen '>
                            
                            <div className='flex  items-center justify-center'>
                                <PlayerLayout opponents={opponentCards} players={players} turn={DATA.turn}/>
                            </div>
                            <CurrentSuit suit={activeSuit}/>
                            {turn === username && <div className="motion-safe:animate-pulse" style={{textAlign:"center",color:"green",fontSize:"28px"}}>Your Turn!</div>}
                            
                            <div style={{textAlign:"center",color:"red",fontSize:"25px",margin:"15px"}}>
                                {warning}
                            </div>
                            
                                <div style={{display:"flex",justifyContent:"center",backgroundColor:"inherit",width:"fit-content",margin:"10px auto 0px auto"
                                ,padding:"15px 75px 15px 75px",borderRadius:"100px"}}  >
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
                    }
                </div>
            </div>
                <div className="bg-purple-200 h-full">
                    
                </div>
        </div>
    )
}



function makeCards(username,room,socket,chooseSuit,cards){
    return cards.map( e=>
        <Card key={e["rank"]+ " " +e["suit"] }
            user={username} 
            rank={e["rank"]} 
            suit={e["suit"]} 
            room={room}
            socket={socket}
            chooseSuit={chooseSuit}
            class_={'card-select'}
        />                                 
    )
}

const CurrentSuit = props =>{
    
    return(
        <div className='flex justify-center mt-3 motion-safe:animate-pulse'>
            Active Suit: 
                <img className="w-10 ml-3 " alt={props.suit} src={`/suits/${props.suit}.svg`}/>
        </div>
    )
}


function CardHand(props){
    //params:username={username} hand={hand} room={ROOM} socket={socket} chooseSuit={chooseSuit}/>

    const hand = makeCards(props.username,props.room,props.socket,props.chooseSuit,props.hand)
    return (
            <div className="hand pb-5">
                {hand}
            </div>
    )   
}

function UpcardDisplay(props)
{
    //params: card={upCard} username={username} socket={socket} ROOM={ROOM} turn={DATA.turn} ID={ID}
    const drawCard = () =>{
        if (props.turn !== props.username){
            return
        }
        props.socket.emit("draw",{
            room:props.ROOM,
            ID:props.ID
        })
    }

    const deckImg = (
        <img 
            alt="1B"
            src="../../cards/1B.svg"
            width="120px"
        /> 
    )                      
    return (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,max-content)",gap:"10px"}}>
                <Card suit={props.card.suit} rank={props.card.rank} />
                <div>{deckImg}</div>
                <button 
                    onClick={drawCard}
                    className='flex items-center justify-center text-white font-bold rounded-full py-2 px-4 bg-red-400 w-20 h-7 ml-5 mt-auto mb-auto hover:bg-red-600'
                >
                    Draw
                </button>
            </div>
    )
    
}

export default WaitingRoom;