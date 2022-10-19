
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function JoinBtn(props){
    // const [btn, setBtn] = useState();
    return (
        <Link to='joinGame'>
            <button id="join" 
                className="
                p-3
                text-xl 
                rounded-full 
                bg-green-300
                mr-1
            "
                
            >
                Join Game
            </button>
        </Link>
    )
}

export default JoinBtn