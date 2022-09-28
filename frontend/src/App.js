
import './App.css';
import { useState } from 'react';

function App() {
  document.title = 'crazy eights'
  const [data,setData] = useState(1);

  const checkInput = (event) =>{
    console.log("vener " + event.target.value)
    const warn = document.querySelector("#warn");
  
    let val = parseInt(event.target.value);
    console.log("before" + data)
    if(!isNaN(event.target.value)){
      console.log("after" + data)
      console.log(typeof(event.target.value))
      console.log(event.target.value)
      if(val< 1 || val > 5){
        warn.innerText = "please make sure to have 1-5 players"
        
        setTimeout(function(){
          warn.innerText = '';
          }, 3000);
          setData(1)
      }

    }else{
      warn.innerText = "";
    }
  }

  return (
    <div>
      <h1 style={{textAlign:'center'}}>Welcome to crazy eights</h1>
      <div style={{display:'grid',justifyContent:'center', gridTemplateColumns:'auto 100px' }}>
        <label style={{textAlign:'center',padding:'5px'}}>How many players? {data} </label>
        <input id="playerCount" onChange={(e)=>{checkInput(e)}} type="number" min="1" max="5" required-pattern="/d{1}" />
      </div>
      <p id="warn" style={{textAlign:'center'}}></p>
      
      <div style={{display:'flex',justifyContent:'center'}}>
      <footer style={{position:'fixed',bottom:'0'}}>
          <div style={{display:'grid',justifyContent:'center',gridTemplateColumns:'repeat(4,auto)', gridGap:'5px'}}>
            <p>Login</p>
            <p>About us</p>
            <p>Donate</p>
            <p>Tutorial</p>
          </div>
        
      </footer>

      </div>

      

    </div>
  );
}

export default App;
