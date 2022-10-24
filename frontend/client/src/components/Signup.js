import {useState,useEffect} from 'react'
import {BrowserRouter as Link} from 'react-router-dom';

function SignUp({ socket }) {
    document.title = "Sign-Up"
    const [user,setUser] = useState("")
    const [pass,setPass] = useState("")
    const [repass,setRepass] = useState("")
    const [warning,setWarning] = useState("")

    useEffect(()=>{
        socket.on("userCreated",message=>{
            setWarning(message)
        })

        socket.on("error",error=>{
            setWarning(error)
        })
    },[socket])

    const create = () =>{
        if(user ==="" || pass ==="" || repass ===""){
            setWarning("Cannot leave fields blank")
            return
        }else if(pass !== repass){
            setWarning("Passwords do not match")
            return
        }
        //cannot call io in here?
        socket.emit("signup",{"username":user,"password":pass})
        
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
            <p style={{display:'flex',justifyContent:'center',margin:'15px'}}>{warning}</p>
            <div style={{display:'grid',justifyContent:"center",gridTemplateColumns:'repeat(2,max-content)',gap:'15px'}}>
                <a id="join" href="null" onClick={create} style={{backgroundColor:"lightblue",borderRadius:'30px',padding:'10px 15px 10px 15px'}}>Create Account!</a>
                <Link to="/" style={{backgroundColor:"lightcoral",borderRadius:'30px',padding:'10px 15px 10px 15px'}}>Cancel</Link>
            </div>
            </main>
        </div>
    )
}

export default SignUp;