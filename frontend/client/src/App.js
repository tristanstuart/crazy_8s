import React, {useState, useEffect} from "react";
import './index.css';
import JoinGame from "./components/JoinGame";
import Footer from './components/Footer'
import AboutUs from "./components/AboutUs";
import Header from "./components/Header";
import Home from "./components/Home";
import CreateGame from "./components/CreateGame";
import { Route, Routes } from "react-router-dom";
import SocketDashboard from "./components/SocketDashboard"
import SignUp from './components/Signup'
import Login from './components/Login'
import Room from "./components/Room";

import io from "socket.io-client";

var sensorEndpoint = "http://127.0.0.1:5000/"
var socket = io.connect(sensorEndpoint, {});

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path ='/' element={<Home/>} />
        <Route path ='about' element={<AboutUs />} />
        <Route path ='createGame' element={<CreateGame socket={socket}/>} />
        <Route path="login" element={<Login socket={socket}/>}/>
        <Route path="signup" element={<SignUp socket={socket}/>}/>
        <Route path ='joinGame' element={<JoinGame socket={socket}/>} />
        <Route path ='createGame' element={<CreateGame />} />
        <Route path ='socketDashboard' element={<SocketDashboard />} />
        
        {/* get rid of, just testing out stuff*/}
        <Route path='gameroom' element={<Room socket={socket}/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;