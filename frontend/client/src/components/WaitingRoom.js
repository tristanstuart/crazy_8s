import {useEffect, useState} from 'react'
import Loading from './WaitBanner'
import {useNavigate} from 'react-router-dom'



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

        socket.on('move_to_game_start', data =>{
            console.log("gameStart",data)
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
        <div >
            <div >
                <div>
                {!gameIsStarted && <Loading />}
                    {!gameIsStarted && <LobbyDisplay socket={socket} players={DATA.playerList} isAdmin={isAdmin} ROOM={ROOM} ID={ID}/>}
                    {gameIsStarted && 
                        <div className='bg-purple-200 h-screen '>
                            
                            <div className='flex  items-center justify-center'>
                                <PlayerLayout opponents={opponentCards} players={players} turn={DATA.turn}/>
                            </div>
                            <CurrentSuit suit={activeSuit}/>
                            {turn === username && <div className="animate-bounce" style={{textAlign:"center",color:"green",fontSize:"28px"}}>Your Turn!</div>}
                            
                            <div style={{textAlign:"center",color:"red",fontSize:"25px",margin:"15px"}}>
                                {warning}
                            </div>
                            
                                <div style={{display:"flex",justifyContent:"center",backgroundColor:"lightgreen",width:"fit-content",margin:"10px auto 10px auto"
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
            

                            <div className='bg-purple-200 h-full'>
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
                            
                            </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}



function makeCards(username,room,socket,chooseSuit,cards){
    return cards.map( e=>
        <Card key={e["rank"]+ " " +e["suit"]}
            user={username} 
            rank={e["rank"]} 
            suit={e["suit"]} 
            room={room}
            socket={socket}
            chooseSuit={chooseSuit}
            class_={'relative flex transition-all transform-gpu rounded-lg shadow-2xl cursor-pointer hover:-mt-20'}
        />
    )
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

function CardHand(props){
    //params:username={username} hand={hand} room={ROOM} socket={socket} chooseSuit={chooseSuit}/>

    const hand = makeCards(props.username,props.room,props.socket,props.chooseSuit,props.hand)
    return (
        <div className="flex space-x-2 items-center justify-center">
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
                    className='flex items-center justify-center rounded-full bg-red-400 w-20 h-7 mt-auto mb-auto'
                >
                    Draw
                </button>
            </div>
    )
    
}

export default WaitingRoom;