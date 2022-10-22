import {useEffect, useState} from 'react'
import io from 'socket.io-client'
import {BrowserRouter as Link} from 'react-router-dom';

function Login({ socket }) {
    document.title = "Login"
    const [username,setUser] = useState("");
    const [password,setPass] = useState("")
    const [warning,setWarning] = useState("");

    //needed so you dont receive the same data multiple times 
    useEffect(()=>{
      socket.on("received",e=>{
      setWarning(e)
      })
      socket.on("error",error=>{
        setWarning(error)
      })
    },[])  
  
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
        <a href="null" style={{backgroundColor:"lightblue",borderRadius:'30px',padding:'10px 15px 10px 15px'}} onClick={login} >Sign-in</a>
            <Link style={{backgroundColor:"lightcoral",borderRadius:'30px',padding:'10px 15px 10px 15px'}} to="/singup"  >Cancel</Link>
        </div>
      
      <p style={{display:'flex',justifyContent:'center'}}>Don't have an account?<a id="signup" href="/signup" style={{marginLeft:'5px'}}>Sign-Up</a></p>
      
    </main>
  </div>
    )
}

export default Login;