import React from "react";
import LeaveGame from "./gameplay/LeaveGame";
import Loading from './Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEnvelope, faGhost, faHippo, faPlane, faPoo, faUserAstronaut } from '@fortawesome/free-solid-svg-icons'

function Lobby({socket, players, isAdmin, ROOM, ID, DATA}){
    let playerCount = 0;
    const icons = [faUserAstronaut, faPoo ,faHippo, faPlane, faGhost]
    const icon_color = ['#d6d3d1', '#a16207', "#d8b4fe", "#c7d2fe", "#fafaf9",]
    return(
        <div>
            <div className="min-h-screen flex-1 bg-gray-200 p-4 flex justify-center items-center">
                <div className="bg-white w-full md:max-w-4xl rounded-lg shadow">
                <div className="h-12 flex justify-between items-center border-b border-gray-200 m-4">
                <div >
                    <div className="text-xl font-bold text-gray-700">
                        Game Lobby: {ROOM}
                    </div>
                    <div className="text-sm font-base text-gray-500 block">
                        <Loading/>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-center w-full  shadow-md rounded-full">
                    <label
                        htmlFor="toogleA"
                        className="flex items-center cursor-pointer"
                    >
                        <div className="flex items-center">
                            <input id="toogleA" type="checkbox" className="hidden"/>
                        <div
                            className="toggle__line w-20 h-10 bg-gray-300 rounded-full shadow-inner"
                        >
                        </div>
                        <div
                            className="toggle__dot bg-red-400 absolute w-10 h-10 bg-white rounded-full shadow flex items-center justify-center"
                        >
                            <svg className="text-white w-6 h-6 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </div>
                        </div>
                    </label>
                    </div>
                </div>
                </div>
                <div className="px-6">
                    <ul>
                        {players.map(data =>
                            (
                                <div className="flex justify-between items-center h-16 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                                    <div className="flex items-center">
                                    {/* <img className="" alt="Avatar" /> */}
                                    <FontAwesomeIcon size="2x" icon={icons[playerCount]} color={icon_color[playerCount++]} />
                                        <div className="ml-2">
                                            <div className="text-sm font-semibold text-gray-600">{data}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="bg-green-400 hover:bg-red-500 p-2 rounded-full shadow-md flex justify-center items-center">
                                            {/* <svg className="text-white toggle__lock w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg> */}
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </ul>

                <div className="flex bg-gray-200 justify-center items-center h-16 p-4 my-6  rounded-lg  shadow-inner">
                    <div className="flex items-center border border-gray-400 p-2 border-dashed rounded cursor-pointer">
                    <div>
                    <svg className="text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    </div>
                    <div className="ml-1 text-gray-500 font-medium"> Invite a friend</div>
                    </div>
                </div>
                </div>
                    <div className="p-6 ">
                        {isAdmin && (
                            <button 
                                className="p-4 bg-green-400 hover:bg-green-500 w-full rounded-lg shadow text-xl font-medium uppercase text-white"
                                onClick={() => {

                                    socket.emit("start_game", {
                                        room:ROOM,
                                        ID:ID
                                    })
                                }}>
                            Start the Game
                            </button>)}
                    </div>
                    <div className="p-6">
                        <LeaveGame
                            socket={socket} 
                            room={ROOM} 
                            ID={ID} 
                            inSession={DATA.inSession} 
                            hand={DATA.hand}
                            user={DATA.user}
                            isAdmin={isAdmin}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Lobby;