import React, {useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from "react-router-dom";

function Navigation(){
    const [showMenu, setShowMenu] = useState(false);

    let menu;
    let menuMask;
    if(showMenu){
        menu = <div
            className="absolute z-10 bg-slate-200 top-0 left-0 h-full shadow p-3 text-4xl w-auto  "
        >
            <span className="font-bold block border-b-2 border-slate-600 pl-3 pt-0">Nav Bar</span>
            <NavLink 
                className={"block p-3 "} 
                to="/" 
                onClick={() => setShowMenu(!showMenu)}
            >
                Home
            </NavLink>
            <NavLink 
                className={"block p-3 "} 
                to="joinGame"
                onClick={() => setShowMenu(!showMenu)}
            >
                Join Game
            </NavLink>
            <NavLink 
                className={"block p-3"} 
                to="createGame"
                onClick={() => setShowMenu(!showMenu)}
            >
                Create Game
            </NavLink>
            <NavLink 
                className={"block p-3"}  
                to="/about"
                onClick={() => setShowMenu(!showMenu)}
            >
                About
            </NavLink>

            <NavLink to="login" 
                className={"block p-3"}  
                onClick={() => setShowMenu(!showMenu)}
            >
                Login
            </NavLink>
            <NavLink to="signup" 
                className={"block p-3"}  
                onClick={() => setShowMenu(!showMenu)}
            >
                Sign-Up
            </NavLink>
            <NavLink 
                className={"block p-3"}  
                to="SandBox"
                onClick={() => setShowMenu(!showMenu)}
            >
                SandBox
            </NavLink>

            <NavLink 
                className={"block p-3"}  
                to="Rules"
                onClick={() => setShowMenu(!showMenu)}
            >
                Rules
            </NavLink>
            <NavLink 
                className={"block p-3"}  
                to="leaderboard"
                onClick={() => setShowMenu(!showMenu)}
            >
                Leader Board
            </NavLink>

        </div>
        menuMask = 
        <div
            className="bg-black-t-50 fixed top-0 left-0 w-full h-full " 
            onClick={() => setShowMenu(false)}
        >
        </div>

    }

    return (
        <nav>
            <span className='text-xl'>
                <FontAwesomeIcon 
                    icon={faBars} 
                    onClick={() => setShowMenu(!showMenu)}
                
                />
                {menuMask}
                {menu}
            </span>
            
        </nav>
            
    )
}

export default Navigation;