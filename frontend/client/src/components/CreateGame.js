import React from "react";

function CreateGame(){
    return (
        <div>
            <form id="start" class="center">
                <input type="text" id="user" placeholder="User Name" />
                <br/>
                <input id="room" type="text" placeholder="Room Name" />
                <br/>
                <input id="create" type="button" onclick="createRoom()" value="Create Game" />
            </form>
        </div>
    )
}

export default CreateGame;