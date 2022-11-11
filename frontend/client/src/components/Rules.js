import React from "react";

function Rules({socket}){
    return (
        <div >
            <h1 className="text-2xl grid items-center justify-center w-screen" >Rules</h1>
                <p className="grid items-center justify-center  p-3" >
                Players try to get rid of their cards by placing them on top of the flipped up card in the center.
                Players may do so if the card they want to get rid of is the same number or suit of the card
                flipped up. 8s are wild and if a player plays an 8, they must state what suit the 8 will be for the
                next player. If a player cannot place any of their cards on the one in the center, they must draw
                cards from the pile until they can do so or until they have drawn a maximum of five cards.</p> 
        </div>
    )

}

export default Rules;