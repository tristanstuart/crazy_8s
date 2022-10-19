import React from "react";
import Footer from "./Footer";
import CreateGame from "./CreateGame";
import { Link } from "react-router-dom";

function JoinGameForm(){
    return (
        <div className="flex items-center justify-center h-screen" >
                <main  >
                    <form id="start" className="p-3">
                    <input id="room" type="text" placeholder="Room Code" />
                    </form>
                    <p className="p-3">
                    Play cards with friends!
                    </p>
                    <Link to="">
                        <button id="join" className="p-3" >Join Game</button>
                    </Link>
                    <Link to="CreateGame"  >
                        <button id="create" className="p-3" >Create a game</button>
                    </Link>
                </main>    
                <Footer />

        </div>
    )
}

export default JoinGameForm;