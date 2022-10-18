import React from "react";
// import '../index.css';

function JoinGameForm(){
    return (
        <div class="center">
                <header>
                    <h1>Crazy 8's</h1>
                </header>
                <main >
                    <form id="start" >
                    <input id="room" type="text" placeholder="Room Code" />
                    </form>
                    <p>
                    Play cards with friends!
                    </p>
                    <a id="join" href="#" onclick="join()" >Join Game</a>
                    <a id="create" href="/admin" >Create a game</a>
                </main>    
        </div>
    )
}

export default JoinGameForm;