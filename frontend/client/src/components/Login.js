import {useState} from 'react'
import io from 'socket.io-client'
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';


const Login = () =>{
    document.title = "Login"
    const [username,setUser] = useState("");
    const [password,setPass] = useState("")
    const [warn,setWarning] = useState("");

    const signin =()=>{
        if(username ==="" || password ===""){
            setWarning("Cannot leave fields blank")
        }else{
            //do stuff with socketio to verify use in database
            setWarning('setup socketio')
        }
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
      <p>{warn}</p>
        <div style={{display:'grid',justifyContent:'center',margin:'15px'}}>
            
            
        </div>

        <div style={{display:'grid',justifyContent:"center",gridTemplateColumns:'repeat(2,max-content)',gap:'15px'}}>
        <a  style={{backgroundColor:"lightblue",borderRadius:'30px',padding:'10px 15px 10px 15px'}} onClick={signin} >Sign-in</a>
            <Link style={{backgroundColor:"lightcoral",borderRadius:'30px',padding:'10px 15px 10px 15px'}} to="/singup"  >Cancel</Link>
        </div>
      
      <p style={{display:'flex',justifyContent:'center'}}>Don't have an account?<a id="signup" href="/signup" style={{marginLeft:'5px'}}>Sign-Up</a></p>
      
    </main>
  </div>
    )
}

export default Login;