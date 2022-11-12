import {useEffect, useState} from 'react'
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login({ socket }) {
    document.title = "Login"
    const [username,setUser] = useState("");
    const [password,setPass] = useState("")
    const [warning,setWarning] = useState("");
    const nav = useNavigate()

    //needed so you dont receive the same data multiple times 
    useEffect(()=>{
      socket.on("received",e=>{
        setWarning(e)
        sessionStorage.setItem("username",username)
        nav("/")
      })
      socket.on("error",error=>{
        setWarning(error)
      })
    },[socket,nav,username])  
  
    const login = () =>{
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
      <p style={{display:"flex",justifyContent:'center'}}>{warning}</p>
      

        <div style={{display:'grid',justifyContent:"center",gridTemplateColumns:'repeat(2,max-content)',gap:'15px'}}>
        <button style={{backgroundColor:"lightblue",borderRadius:'30px',padding:'10px 15px 10px 15px'}} onClick={login} >Sign-in</button>
            <NavLink style={{backgroundColor:"lightcoral",borderRadius:'30px',padding:'10px 15px 10px 15px'}} to="/signup"  >Cancel</NavLink>
        </div>
      
      <p style={{display:'flex',justifyContent:'center'}}>Don't have an account?<a id="signup" href="/signup" style={{marginLeft:'5px'}}>Sign-Up</a></p>
      
    </main>
  </div>
    )
}

export default Login;