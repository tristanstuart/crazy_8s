import React from "react";
import JoinRmBtn from "./buttons/JoinRmBtn";

function JoinGame(){

        return (
            <div className="grid items-center justify-center h-screen bg-purple-300" >
                    <main>
                        <form id="start" type="submit">
                            <input 
                                id="name" 
                                type="text" 
                                value="" 
                                placeholder="Enter Username" 
                                className="p-3 text-2xl rounded-full grid items-center justify-center"
                                
                            />
                            <input 
                                id="room" 
                                type="text" 
                                value="test"
                                placeholder="Enter Room Code" 
                                className="p-3 text-2xl rounded-full mt-1"
                                  
                            />
                        </form>
                            
                        
                        <JoinRmBtn 
                            
                        />
                    </main>    
    
            </div>
        )
}

export default JoinGame;