import {useEffect, useState} from 'react'

import Card from './Card'

//split all these components up into seperate js files

const MakeCards = props =>{
    const cards = props.cards.map(e=>
        <Card key={e}
            type={e} 
            upCard={props.upCard} 
            suit={props.suit} 
            gameroom={props.gameroom} 
            socket={props.socket} 
            player={props.player} 
        />
    )
    return(
        cards
    )
}

const Container =props=>{

    return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,auto)",gap:"15px"}}>
            <MakeCards 
                cards={props.cards}
                upCard={props.upCard} 
                suit={props.suit} 
                gameroom={props.gameroom} 
                socket={props.socket} 
                player={props.username}
            />
        </div>
    )
}

const DrawCard = props =>{
    const socket = props.socket
    const drawCard = () =>{
        socket.emit("action",{
            "gameroom":props.gameroom,
            "username":props.player,
            "action":"draw",
            "card":null
        })    
    }

    return(
        <div style={{display:'grid',justifyContent:'center'}} onClick={drawCard}>
            <img alt={"Deck"} src="/cards/back.svg" style={{width:'120px'}} />
        </div>
    )
}

const Pile = props =>{
    console.log("gameroom in pile",props.gameroom)
    return(
        <div>
            <h1 style={{textAlign:"center"}}>Current card is {props.type}. Current suit is {props.suit}</h1>
            <div style={{display:"grid",gridTemplateColumns:"auto auto", gap:"20px",margin:"15px"}}>
                <TopCard type={props.type}/>
                <DrawCard player={props.player} gameroom={props.gameroom} socket={props.socket}/>
            </div>
        </div>
    )
}

const TopCard = props =>{
    
    return (
        <div style={{display:'grid',justifyContent:'center'}}>
            {props.type !== null?
                <img alt={props.style} src={`/cards/${props.type}.svg`} style={{width:'120px'}} />
            :<div/>
            }
        </div>
    )
}

const Room = props =>{

    const [gameroom,setGame] = useState("")
    const [cards,setCards] = useState([])
    const [upcard,setUpCard] = useState(null)
    const [suit,setSuit] = useState("")
    const username = localStorage.getItem("username")
    const socket = props.socket
    
    const begin =() =>{
        if(gameroom.trim().length === 0 || gameroom.includes(" ")){
            console.log("cannot leave fields blank or empty spaces")
            return
        }
        socket.emit("begin game",{
            "gameroom":gameroom,
            "players":[{"username":username}]
        }
    
    )}

    

    useEffect(()=>{
        console.log("im called")
        socket.on(username,e=>{
            console.log("listen to username2",e)
            setCards(
                e.cards.map( s=>s))
        })

        socket.on("newDisplay",newDisplay =>{
            
            console.log("newDisplay1",newDisplay)
            setUpCard(newDisplay.upCard)
            setSuit(newDisplay.activeSuit)
            
        })
        
        socket.on("status", status =>{
            console.log("status3",status)
        })

        socket.on("error",error =>{
            console.log(error)
        })

    },[])
    
    return (
        <div >            
            <div style={{display:"flex",justifyContent:'center',margin:"15px"}} id="holder">
                <button 
                    style={{
                        border:"none",
                        backgroundColor:"lightcoral", 
                        borderRadius:"30px",
                        padding:"15px"
                    }}
                    onClick={begin}>
                    Start Game
                </button>
                <input 
                    type="text" 
                    placeholder="text area" 
                    style={{textAlign:"center",backgroundColor:"lightblue",borderRadius:"30px"}}
                    onChange={e=>{setGame(e.target.value)}}>
                </input>
            </div>

            <div style={{display:'flex',justifyContent:'center'}}>
                
                <div style={{display:"grid",justifyContent:"center"}}>
                    <Pile 
                        gameroom={gameroom} 
                        suit={suit} 
                        type={upcard} 
                        socket={socket} 
                        player={username}
                    />
                </div>

                <div style={{position:'fixed',bottom:"0"}}>
                    <div style={{display:'flex',justifyContent:'center',margin:"30px"}}>
                        <Container gameroom={gameroom} cards={cards} username={username} upCard={upcard} suit={suit} socket={socket}/>
                        {upcard === null?<div/>:console.log("1",username,upcard,suit,cards)}
                    </div>
                </div>    
            </div>
        </div>
    )
}

export default Room;