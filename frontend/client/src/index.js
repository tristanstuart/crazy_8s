import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import io from "socket.io-client";
import {useNavigate} from 'react-router-dom'

const session = JSON.parse(sessionStorage.getItem("data"))

const socket= io("http://127.0.0.1:5000",{
  transports: ['websocket']
}) //change this to whatever server is

const Navo = () =>{
  const nav = useNavigate()
  useEffect(()=>{
    socket.on("joinAgain",e=>{
      console.log("join the room",e)
      nav('/waitingRoom', {state:{room:session.room, playerList:session.playerList, user:session.user, isAdmin:session.isAdmin}})

    })
  },[nav])
  return <div/>
}

socket.on("connect",()=>{
  if(sessionStorage.getItem("data") == null){
    socket.emit("need")
    console.log("i need a cookie")
    return
  }
  if(session.room !== null){
    console.log(session.room)
    socket.emit("reconnect",session)
  }
  // socket.emit("reconnect",session)
})

socket.on("disconnect",()=>{
  console.log("ummm your disconnecting buddy")
  socket.emit("reconnect",session)
})

socket.on("deadRoom",message=>{
  console.log(message)
})



socket.on("data",data=>{
  sessionStorage.setItem("data",JSON.stringify(data))
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    
    <Router>
      <Navo/>
      <App socket={socket}/>
    </Router>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
