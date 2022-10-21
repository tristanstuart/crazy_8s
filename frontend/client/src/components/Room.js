import {useEffect, useState} from 'react'

const Room = props =>{
    //works both ways
    //const [socket,setSock] = useState(props.socket)
    const socket = props.socket
    
    const begin =() =>{
        socket.emit("begin game",{
            "players":[{"username":"marco"}]
        }
    
    )}

    useEffect(()=>{
        socket.on("response",response=>{
            console.log(response)
        })

        socket.on("start",response=>{
            console.log(response)
        })

    },[])
    
    return (
        <div onClick={e=>{console.log("you clicked")}}>
            {/* <Button/> */}
            <div>
                <button 
                style={{border:"none",backgroundColor:"lightcoral",padding:'15px', borderRadius:"30px"}}
                onClick={begin}
            >
                Start Game
            </button>
        </div>
            hey
        </div>
    )
}

export default Room;