import React, {useState, useEffect} from "react";
import io from "socket.io-client";

import './index.css';
// import './App.css'
import JoinGameForm from "./components/JoinGameForm";
import Footer from './components/Footer'
import AboutUs from "./components/AboutUs";
import Header from "./components/Header";
import Home from "./components/Home";
import CreateGame from "./components/CreateGame";
import { Route, Routes } from "react-router-dom";
import Page from './components/Card'
import Login from './components/Login'
import SignUp from './components/Signup'

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const App = () => {

  // socket-io functions



  return (
    <div>
      <Header />
      <Routes>
       <Route path ='/' element={<JoinGameForm />} />
        <Route path ='joinGame' element={<JoinGameForm />} />
        <Route path ='about' element={<AboutUs />} />
        <Route path ='createGame' element={<CreateGame />} />
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<SignUp/>}/>
      </Routes>
      {/* <JoinGameForm /> */}
      {/* <Footer /> */}
      {/* <AboutUs /> */}
    </div>
      
    
  );
}

export default App;
