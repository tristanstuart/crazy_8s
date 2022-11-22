import React from "react";
import ReactLoading from "react-loading";
  
export default function Loading() {
  return(
        <div className="flex">
            Waiting for players to join 
            <ReactLoading 
                type="bubbles" 
                color="#0000FF"
                height={30} 
                width={30} 
                
            />
        </div>
    );
}
