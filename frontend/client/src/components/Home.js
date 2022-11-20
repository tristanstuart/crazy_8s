import React from "react";
import { Link} from "react-router-dom";
import JoinBtn from "./buttons/JoinBtn";

function Home({socket}){

    return (
        <div className="bg-[url('https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1035-17545.jpg?w=740&t=st=1668965518~exp=1668966118~hmac=6b5258099db85fe3dc3aaee8d588407e4a3a3bcc406fbfd741765aae367a4030')] flex items-center justify-center h-screen" >
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