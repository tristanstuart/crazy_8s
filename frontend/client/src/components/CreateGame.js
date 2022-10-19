import React from "react";

function CreateGame(){
    return (
        <div className="flex items-center justify-center h-screen text-xl ">
            <form id="start">
                <input type="text" id="user" placeholder="User Name" className="p-3" />
                <br/>
                <input id="room" type="text" placeholder="Room Name" className="p-3"/>
                <br/>
                <button className="p-3">Create Game</button>
            </form>
        </div>
    )
}

export default CreateGame;