import {useEffect, useState,useRef} from 'react'

import Card from './Card'

const Container =props=>{
    console.log("ummmm")
    return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,auto)",gap:"15px"}}>
            {props.card}
        </div>
    )
}

const Room = props =>{
    //works both ways
    //const [socket,setSock] = useState(props.socket)
    const socket = props.socket
    const [cards,setCards] = useState([])
    const begin =() =>{
        socket.emit("begin game",{
            "players":[{"username":"marco"}]
        }
    
    )}
    

    useEffect(()=>{
        socket.on("dealtCards",response=>{
            console.log(response.trim().split(" "))
            setCards(response.trim().split(" ").map(e => <Card type={e} key={e}/>))
            console.log("cards? ",cards)
        })

        socket.on("start",response=>{
            console.log(response)
        })

    },[])
    
    return (
        <div onClick={e=>{console.log("you clicked")}}>
            
            <div style={{display:"flex",justifyContent:'center',margin:"15px"}}>
                <button 
                style={{border:"none",backgroundColor:"lightcoral", borderRadius:"30px",padding:"15px"}}
                onClick={begin}
                >
                Start Game
                </button>
            </div>


            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{position:'fixed',bottom:"0"}}>
                    <div style={{display:'grid',justifyContent:'center',margin:"30px"}}>
                        <Container card={cards}/> 
                    </div>
                </div>    
            </div>

        </div>
    )
}

export default Room;