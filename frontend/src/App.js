
import './App.css';
import { useState } from 'react';

function App() {
  document.title = 'crazy eights'
  const [data,setData] = useState(0);

  const checkInput = (event) =>{
    const warn = document.querySelector("#warn");
  
    const val= parseInt(event.target.value);
    if(!isNaN(event.target.value)){
      console.log(typeof(event.target.value))
      console.log(event.target.value)
      if(val< 1 || val > 5){
        warn.innerText = "please make sure to have 1-5 players"
        setData(0)
      }else{
        setData(val)
        warn.innerText = "";
      }
    }
  }

  return (
    <div>
      <h1 style={{textAlign:'center'}}>Welcome to crazy eights</h1>
      <div style={{display:'grid',justifyContent:'center', gridTemplateColumns:'auto 100px' }}>
        <label style={{textAlign:'center',padding:'5px'}}>How many players? </label>
        <input id="playerCount" onChange={(e)=>{checkInput(e)}} type="number" min="1" max="5" required-pattern="/d{1}" />
      </div>
      <p id="warn" style={{textAlign:'center',color:'red'}}></p>
      <p id="totalPlayers" style={{textAlign:'center'}} >{data>0?`${data} players`:''}</p>
      
      <div style={{display:'flex',justifyContent:'center'}}>
      <footer style={{position:'fixed',bottom:'0'}}>
          <div style={{display:'grid',justifyContent:'center',gridTemplateColumns:'repeat(4,auto)', gap:'5px',padding:'5px'}}>
            <a href="#">Login</a>
            <a href="#">About us</a>
            <a href="#">Donate</a>
            <a href="#">Tutorial</a>
          </div>
        
      </footer>

      </div>

      

    </div>
  );
}

export default App;
