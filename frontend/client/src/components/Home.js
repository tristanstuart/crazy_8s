import React from "react";
import { Link} from "react-router-dom";

function Home({socket}){

    return (
        <div className="bg-blue-triangles flex items-center justify-center h-screen" >
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
                </main>    
                

        </div>
    )
}


export default Home;