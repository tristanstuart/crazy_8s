import io from 'socket.io-client'
import {useEffect, useState} from 'react'
// var sensorEndpoint = "http://127.0.0.1:5000/"
// var socket = io.connect(sensorEndpoint, {});




const Button = () =>{
    
    useEffect(()=>{
        socket.on("response",response=>{
            console.log(response)
        })

        socket.on("start",response=>{
            console.log(response)
        })

    },[])

    const begin =() =>{
        socket.emit("begin game",{
            "players":[{"username":"marco"}]
        }
    
    )}

    return(
        <div>
            <button 
                style={{border:"none",backgroundColor:"lightcoral",padding:'15px', borderRadius:"30px"}}/
                onClick={begin}
            >
                Start Game
            </button>
        </div>
    )
// }

const Gameroom = () =>{
    return (
        <div>
            {/* <Button/> */}
            hey
        </div>
    )
}

export default Gameroom;