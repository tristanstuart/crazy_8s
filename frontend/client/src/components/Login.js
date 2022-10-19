import {useEffect, useState} from 'react'
import io from 'socket.io-client'
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

var sensorEndpoint = "http://127.0.0.1:5000/"
var socket = io.connect(sensorEndpoint, {
    // reconnection: true,
    // transports: ['websocket']
});
const Login = () =>{
    document.title = "Login"
    const [username,setUser] = useState("");
    const [password,setPass] = useState("")
    const [warn,setWarning] = useState("");

    useEffect(()=>{
      socket.on("received",e=>{
      console.log(e)
      })
      socket.on("error",error=>{
        setWarning(error)

      })
    return ()=>{
      socket.off("received")
    }},[])  
  

    const signin = () =>{
      if(username ==="" || password ===""){
        setWarning("Cannot leave fields blank")
        return
      } 
      socket.emit("login",{"username":username,"password":password})
    }

    return(<div>
        <header>
      <h1 style={{display:'flex',justifyContent:'center'}}>Crazy 8's Login</h1>
    </header>
    <main >
      <div id="start"style={{display:'grid',justifyContent:'center',gridTemplateColumns:'repeat(1,auto)',margin:'15px'}}>
        <input onChange={e=>setUser(e.target.value)} style={{textAlign:'center',}} id="username" type="text" placeholder="User Name" required/>
        <input onChange={e=>setPass(e.target.value)} style={{textAlign:'center',}} id="password" type="text" placeholder="Password" required/>
      </div>
      <p style={{display:"flex",justifyContent:'center'}}>{warn}</p>
      

        <div style={{display:'grid',justifyContent:"center",gridTemplateColumns:'repeat(2,max-content)',gap:'15px'}}>
        <a href="#" style={{backgroundColor:"lightblue",borderRadius:'30px',padding:'10px 15px 10px 15px'}} onClick={signin} >Sign-in</a>
            <Link style={{backgroundColor:"lightcoral",borderRadius:'30px',padding:'10px 15px 10px 15px'}} to="/singup"  >Cancel</Link>
        </div>
      
      <p style={{display:'flex',justifyContent:'center'}}>Don't have an account?<a id="signup" href="/signup" style={{marginLeft:'5px'}}>Sign-Up</a></p>
      
    </main>
  </div>
    )
}

export default Login;