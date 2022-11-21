import React from "react";
import LeaveGame from "./LeaveGame";
import Loading from './Loading'

function Lobby(props){
    
    return(
        <div>
            <div class="min-h-screen flex-1 bg-gray-200 p-4 flex justify-center items-center">
                <div class="bg-white w-full md:max-w-4xl rounded-lg shadow">
                <div class="h-12 flex justify-between items-center border-b border-gray-200 m-4">
                <div >
                    <div class="text-xl font-bold text-gray-700">
                        Game Lobby: {props.ROOM}
                    </div>
                    <div class="text-sm font-base text-gray-500 block">
                        <Loading/>
                    </div>
                </div>
                <div>
                    <div class="flex items-center justify-center w-full  shadow-md rounded-full">
                    <label
                        htmlFor="toogleA"
                        class="flex items-center cursor-pointer"
                    >
                        <div class="flex items-center">
                            <input id="toogleA" type="checkbox" class="hidden"/>
                        <div
                            class="toggle__line w-20 h-10 bg-gray-300 rounded-full shadow-inner"
                        >
                        </div>
                        <div
                            class="toggle__dot bg-red-400 absolute w-10 h-10 bg-white rounded-full shadow flex items-center justify-center"
                        >
                            <svg class="text-white w-6 h-6 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </div>
                        </div>
                    </label>
                    </div>
                </div>
                </div>
                <div class="px-6">
                    <ul>
                        {props.players.map(data =>
                            (
                                <div class="flex justify-between items-center h-16 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                                    <div class="flex items-center">
                                    {/* <img class="" alt="Logo" /> */}
                                        <div class="ml-2">
                                            <div class="text-sm font-semibold text-gray-600">{data}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <button class="bg-red-400 hover:bg-red-500 p-2 rounded-full shadow-md flex justify-center items-center">
                                            <svg class="text-white toggle__lock w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </ul>

                <div class="flex bg-gray-200 justify-center items-center h-16 p-4 my-6  rounded-lg  shadow-inner">
                    <div class="flex items-center border border-gray-400 p-2 border-dashed rounded cursor-pointer">
                    <div>
                    <svg class="text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    </div>
                    <div class="ml-1 text-gray-500 font-medium"> Invite a friend</div>
                    </div>
                </div>
                </div>
                    <div class="p-6 ">
                        {props.isAdmin && (
                        <button 
                            class="p-4 bg-green-400 hover:bg-green-500 w-full rounded-lg shadow text-xl font-medium uppercase text-white"
                            onClick={() => {

                                props.socket.emit("start_game", {
                                    room:props.ROOM,
                                    ID:props.ID
                                })
                            }}>
                        Start the Game
                        </button>)}
                    </div>
                    <div class="p-6">
                        <LeaveGame />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Lobby;