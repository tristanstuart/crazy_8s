import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faRepeat } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect } from 'react';

export default RuleAnimation;

function RuleAnimation(props){



    let animation;
    if(props.rule === 'reverse'){
       animation = 
       <div className=" rule ">
            <div className="text-black font-bold uppercase text-8xl motion-safe:animate-pulse ml-5">
                {props.rule}
            </div>
            <FontAwesomeIcon icon={faRepeat} size='10x' color="#ffff00" spin className="ml-20" />
        </div>     
    }
    else if(props.rule === "skip"){
        animation = 
       <div className="rule">
            <div className="text-bright-red font-bold uppercase text-9xl ">
                skip
            </div>
            <FontAwesomeIcon icon={faBan} size='10x' color="#ff0000" beat className="ml-20 "/>
        </div> 
    }
    else if (props.rule === "draw2"){
        animation = 
       
            <div className="draw2 uppercase">
                draw 2
            </div>
            
        
    }
    return (
        <div className='relative'>
            {animation}
        </div>
        )
}