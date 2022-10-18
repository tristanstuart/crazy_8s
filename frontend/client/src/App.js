import React, {useState, useEffect} from "react";
import io from "socket.io-client";

import './index.css';
// import './App.css'
import JoinGameForm from "./components/JoinGameForm";
import Footer from './components/Footer'
import AboutUs from "./components/AboutUs";
import Header from "./components/Header";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const App = () => {

  // socket-io functions



  return (
    <div>
      <Header />
      <Routes>
        <Route path ='/' element={<JoinGameForm />} />
        <Route path ='about' element={<AboutUs />} />
      </Routes>
      {/* <JoinGameForm /> */}
      {/* <Footer /> */}
      {/* <AboutUs /> */}
    </div>
      
    
  );
}

export default App;
