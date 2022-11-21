import { useEffect, useState } from "react"

const LeaderBoard = ({socket}) =>{
    
    const [playerName,setNames] = useState()
    const [playerScore,setWins] = useState()
    useEffect(()=>{
        //can change this to socket.emit/socket.on to do the same thing
        fetch("http://127.0.0.1:5000/scores").then(res=>res.json()).then(result=>{            
            setNames(result.map(e=>
                <div key={e.name}>
                    {e.name}
                </div>))
            setWins(result.map(e=>
                <div key={e.name}>
                    {e.wins}
                </div>))
        })
    },[])

    return (
        <div>       
            <h1 style={{textAlign:"center"}}>LeaderBoard</h1>
            <div style={{display:"flex",justifyContent:"center"}}>
                <div style={{display:"grid",justifyContent:"center",padding:"25px",gap:"50px",backgroundColor:"#CBC7FC",gridTemplateColumns:"max-content max-content",width:"max-content",borderRadius:"30px"}}>
                    <div style={{display:"grid",gap:"10px"}}>
                        <div style={{textAlign:"center"}}>Name</div>
                        {playerName}
                    </div>
                    <div style={{display:"grid",gap:"10px"}}>
                        <div style={{textAlign:"center"}}>Wins</div>
                        {playerScore}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeaderBoard