import React from "react";

function AboutUs({socket}){
    return (
        <div >
            <h1 className="text-2xl grid items-center justify-center w-screen" >About Us</h1>
                <p className="grid items-center justify-center  p-3" >
                    We are a group of Computer Science students creating an online version of the card game Crazy 8's. 
                    This website features persistent accounts as well as the ability to play the game with friends! For the project, 
                    we are utilizing Flask for the back-end server and React for the front-end website. The game itself uses SocketIO to communicate information between client and server for a responsive game experience. 
                    This project is being made for our Fall 2022 Software Engineering course.</p> 
                <p className="p-3 ">
                    Project members include:</p>
                <ul className="p-3 ">
                    <li>Christian Davis</li>
                    <li>Tristan Stuart</li>
                    <li>Emmanuel George Sapolucia</li>
                    <li>Quinn Templeton</li>
                    <li>Marco Roman</li>
                </ul>
        </div>
    )

}

export default AboutUs;