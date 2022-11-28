import React from "react";
import { Link} from "react-router-dom";

function Home({socket}){

    return (
        <div className="bg-blue-triangles bg-cover flex items-center justify-center h-screen" >
                <main>
                    <p className="p-3 text-xl">
                    Play Crazy 8's with friends!
                    </p>
                    <Link to='joinGame'>
                    <button 
                        className="p-3 text-xl rounded-full  bg-green-300 mr-1 border-solid border-2 border-black">
                        Join Game
                    </button>
                    </Link>
                    <Link to="CreateGame"  >
                        <button 
                            className="inline-block p-3 text-xl rounded-full bg-blue-300 border-solid border-2 border-black" >
                        Create Game</button>
                    </Link>
                    <div className="flex items-center justify-center ">
                        <Link to="Rules"  >
                                    <button 
                                        className="position: absolute; left: 00px top: 100px p-3 text-xl rounded-full bg-blue-300 border-solid border-2 border-black" >
                                    How To Play</button>
                        </Link>
                    </div>
                </main>    
                
                
        </div>
        
    )
}


export default Home;