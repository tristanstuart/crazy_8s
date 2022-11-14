import React from "react";
import { Link} from "react-router-dom";
import JoinBtn from "./buttons/JoinBtn";

function Home({socket}){

    return (
        <div className="flex items-center justify-center h-screen" >
                <main>
                    <p className="p-3 text-xl">
                    Play Crazy 8's with friends!
                    </p>
                    <JoinBtn />
                    <Link to="CreateGame"  >
                        <button id="create" 
                            className="inline-block p-3 text-xl rounded-full bg-blue-300" >
                        Create Game</button>
                    </Link>
                </main>    
                

        </div>
    )
}


export default Home;