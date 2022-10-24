import React from "react";
import ReactLoading from "react-loading";
  
export default function Loading() {
  return (
    <div>
      <h2 className="flex items-start">Waiting for admin to start game {<Wait />} </h2>
      {/* <ReactLoading type="bubbles" color="#0000FF"
        height={100} width={50} /> */}
    </div>
  );
}

function Wait(){
    return(
        <ReactLoading 
            type="bubbles" 
            color="#0000FF"
            height={100} 
            width={30} 
            
        />
    )
}