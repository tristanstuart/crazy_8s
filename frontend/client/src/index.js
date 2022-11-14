import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import io from "socket.io-client";

const socket= io("http://127.0.0.1:5000",{
  transports: ['websocket'] 
}) //needed when running backend as python app.py

const session = JSON.parse(sessionStorage.getItem("session"))
const DATA = sessionStorage.getItem("data") !== null?JSON.parse(sessionStorage.getItem("data")):null;

//if the user refreshed the page, the server needs to reassign their new request.sid associated with the client
const pageAccessedByReload = (
  (window.performance.navigation && window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map((nav) => nav.type)
      .includes('reload')
);

if(pageAccessedByReload){
  socket.emit("newSID",session)
}

socket.on("connect",()=>{
  if(session == null){
    socket.emit("needSession")
  }
})

socket.on("disconnect",()=>{
  console.log("ummm your disconnecting buddy")
})

socket.on("deadRoom",message=>{
  console.log(message)
})

socket.on("session",data=>{
  sessionStorage.setItem("session",JSON.stringify(data))
})

//not sure where im going with this, im guessing rejoin a gameroom ,
//dont know if it should auto redirect on a successful response, or let the user leave
if(DATA !== null){
  if(DATA.room != null){
    socket.emit("pendingRoom",{
      room:DATA.room,
      ID:session.ID
    })
  }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    
    <Router>
      <App socket={socket}/>
    </Router>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();