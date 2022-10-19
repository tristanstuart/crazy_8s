import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from "react-router-dom";
import {useTransition, animated} from 'react-spring'

function Navigation(){
    const [showMenu, setShowMenu] = useState(false);

    let menu;
    let menuMask;
    if(showMenu){
        menu = <div
            className="fixed bg-white top-0 left-0 w-4/5 h-full shadow p-3 "
        >
            <span className="font-bold block p-3">The Menu</span>
            <NavLink 
                className={"block p-1"} 
                to="/" 
                onClick={() => setShowMenu(!showMenu)}
            >
                Home
            </NavLink>
            <NavLink 
                className={"block p-1"} 
                to="joinGame"
                onClick={() => setShowMenu(!showMenu)}
            >
                Join Game
            </NavLink>
            <NavLink 
                className={"block p-1"} 
                to="createGame"
                onClick={() => setShowMenu(!showMenu)}
            >
                Create Game
            </NavLink>
            <NavLink 
                className={"block p-1"}  
                to="/about"
                onClick={() => setShowMenu(!showMenu)}
            >
                About
            </NavLink>
            <NavLink to="login" 
                className={"block p-1"}  
                onClick={() => setShowMenu(!showMenu)}
            >
                Login
            </NavLink>
            <NavLink to="signup" 
                className={"block p-1"}  
                onClick={() => setShowMenu(!showMenu)}
            >
                Sign-Up
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