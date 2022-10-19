import React from "react";

function AboutUs(){
    return (
        <div>
            <h1>About Us</h1>
                <p>We are a group of Computer Science students creating an online version of the card game Crazy 8's. This website features persistent accounts as well as the ability to play the game with friends! For the project, we are utilizing Flask for the back-end server and React for the front-end website. The game itself uses SocketIO to communicate information between client and server for a responsive game experience. This project is being made for our Fall 2022 Software Engineering course.</p> 
                <p>Project members include:</p>
                <ul>
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