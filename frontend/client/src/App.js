import React, {useState, useEffect} from "react";
// import io from "socket.io-client";

import './index.css';
// import './App.css'
import JoinGame from "./components/JoinGame";
import Footer from './components/Footer'
import AboutUs from "./components/AboutUs";
import Header from "./components/Header";
import Home from "./components/Home";
import CreateGame from "./components/CreateGame";
import { Route, Routes } from "react-router-dom";
import SocketDashboard from "./components/SocketDashboard"

// let endPoint = "http://127.0.0.1:5000";
// let socket = io.connect(`${endPoint}`);
import Page from './components/Card'
import Login from './components/Login'
import SignUp from './components/Signup'

import Page from './components/Card'
import Login from './components/Login'
import SignUp from './components/Signup'

import SocketDashboard from "./components/SocketDashboard"


// let endPoint = "http://127.0.0.1:5000";
// let socket = io.connect(`${endPoint}`);


const App = () => {

  
  return (
    <div>
      
      <Header />
      <Routes>
        <Route path ='/' element={<Home  />} />
        <Route path ='joinGame' element={<JoinGameForm />} />
        <Route path ='about' element={<AboutUs />} />
        <Route path ='createGame' element={<CreateGame />} />
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<SignUp/>}/>
        <Route path ='joinGame' element={<JoinGame />} />
        <Route path ='about' element={<AboutUs />} />
        <Route path ='createGame' element={<CreateGame />} />
        <Route path ='socketDashboard' element={<SocketDashboard />} />

      </Routes>
      <Footer />
    </div>
      
    
  );
}

export default App;
