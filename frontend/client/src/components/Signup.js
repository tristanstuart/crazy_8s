import {useState,useEffect} from 'react'
import io from 'socket.io-client'
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

const SignUp = () =>{
    document.title = "Sign-Up"
    const [user,setUser] = useState("")
    const [pass,setPass] = useState("")
    const [repass,setRepass] = useState("")
    const [warning,setWarn] = useState("")
    const create = () =>{
        if(user ==="" || pass ==="" || repass ===""){
            setWarn("Cannot leave fields blamk")
            return
        }else if(pass !== repass){
            setWarn("Passwords do not match")
            return
        }
        //cannot call io in here?
        setWarn("figure out how to to send this info to socket io")
        
    }

    return(
        <div>
            <header>
            <h1 style={{textAlign:'center',margin:'20px'}}>Crazy 8's Sign-Up</h1>
            </header>
            <main >
            <div style={{display:'grid',justifyContent:"center",margin:"15px"}}>
                <input style={{textAlign:'center'}} onChange={e=>setUser(e.target.value)} type="text" placeholder="User Name" required/>
                
                <input style={{textAlign:'center'}} onChange={e=>setPass(e.target.value)} type="text" placeholder="Password" required/>
                
                <input style={{textAlign:'center'}} onChange={e=>setRepass(e.target.value)} type="text" placeholder="Re-Enter Password" required/>
            </div>
            <p>{warning}</p>
            <div style={{display:'grid',justifyContent:"center",gridTemplateColumns:'repeat(2,max-content)',gap:'15px'}}>
                <a id="join" href="#" onClick={create} style={{backgroundColor:"lightblue",borderRadius:'30px',padding:'10px 15px 10px 15px'}}>Create Account!</a>
                <Link to="/" style={{backgroundColor:"lightcoral",borderRadius:'30px',padding:'10px 15px 10px 15px'}}>Cancel</Link>
            </div>
            </main>
        </div>
    )
}

export default SignUp;