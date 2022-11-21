import { useEffect, useState } from "react"

//do i even need a socket
const LeaderBoard = ({socket}) =>{
    
    const [player,setPlayer] = useState()
    useEffect(()=>{
        fetch("http://127.0.0.1:5000/scores").then(res=>res.json()).then(result=>{
            setPlayer(result.map(e => <span key={e["name"]} sytle={{textAlign:"center"}}>{e["name"] + " " + e["wins"]}</span>))
        })
    },[])

    return (
        <div>
            <h1 style={{textAlign:"center"}}>LeaderBoard</h1>
            <div style={{display:"flex",justifyContent:"center"}}>
                {/* gridtemplateColumsn */}
                <div style={{display:"grid",justifyContent:"center",padding:"15px",gap:"75px",backgroundColor:"#CBC7FC",gridTemplateColumns:"max-content max-content",width:"max-content",borderRadius:"30px"}}>
                    {/* <div>NAME Score</div>
                    {player} */}
                    <span>Name</span>
                    <span>Wins</span>
                </div>
            </div>
        </div>
    )
}

export default LeaderBoard