import React, {useState, useEffect} from "react";
import io from "socket.io-client";
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
import WaitingRoom from "./components/WaitingRoom";

//referenced this article for setting up a single global socket:
//https://developer.okta.com/blog/2021/07/14/socket-io-react-tutorial

function App() {
	const [socket, setSocket] = useState(null)

	useEffect(() =>{
		const newSocket = io("http://127.0.0.1:8000") //change this to whatever server is
		setSocket(newSocket)
		return() => newSocket.close();
	}, [setSocket]);

  return (
    <div>
      <Header />
	  { socket ? (
      <Routes>
        <Route path ='/' element={<Home  />} />
        <Route path ='about' element={<AboutUs />} />
        <Route path="login" element={<Login socket={socket}/>}/>
        <Route path="signup" element={<SignUp socket={socket}/>}/>
        <Route path ='joinGame' element={<JoinGame socket={socket}/>} />
        <Route path ='createGame' element={<CreateGame socket={socket}/>} />
        <Route path ='socketDashboard' element={<SocketDashboard socket={socket}/>} />
        <Route path ='waitingRoom' element={<WaitingRoom socket={socket}/>} />
      </Routes>
	) : <div>Connecting...</div>}
      <Footer />
    </div>
  );
}

export default App;