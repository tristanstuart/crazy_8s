import './index.css';
import JoinGame from "./components/JoinGame";
import AboutUs from "./components/AboutUs";
import Header from "./components/Header";
import Home from "./components/Home";
import CreateGame from "./components/CreateGame";
import { Route, Routes } from "react-router-dom";
import SignUp from './components/Signup'
import Login from './components/Login'
import WaitingRoom from "./components/WaitingRoom";
import GameRoom from "./components/GameRoom";
import SandBox from "./components/SandBox"
import Rules from "./components/Rules";
import LeaderBoard from "./components/LeaderBoard";

//referenced this article for setting up a single global socket:
//https://developer.okta.com/blog/2021/07/14/socket-io-react-tutorial

function App({socket}) {

  return (
    <div>
      <Header />
	  { socket ? (
      
      <Routes>
        <Route path ='/' element={<Home  socket={socket}/>} />
        <Route path ='about' element={<AboutUs socket={socket}/>} />
        <Route path="login" element={<Login socket={socket}/>}/>
        <Route path="signup" element={<SignUp socket={socket}/>}/>
        <Route path ='joinGame' element={<JoinGame socket={socket}/>} />
        <Route path ='createGame' element={<CreateGame socket={socket}/>} />
        <Route path ='waitingRoom' element={<WaitingRoom socket={socket}/>} />
        <Route path ='gameRoom' element={<GameRoom socket={socket}/>} />
        <Route path ='Sandbox' element={<SandBox socket={socket}/>} />
        <Route path ='Rules' element={<Rules socket={socket}/>} />
        <Route path ='leaderboard' element={<LeaderBoard socket={socket}/>} />
      </Routes>
	) : <div>Connecting...</div>}
      
    </div>
  );
}

export default App;