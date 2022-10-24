import {useLocation} from 'react-router-dom'
import { Socket } from 'socket.io-client';
	

const rankMap = new Map([
  ["ace", "A"],
  ["Ace", "A"],
  ["1", "A"],
  ['two', "2"],
  ['Two', "2"],
  ['2', '2'],
  ["three", "3"],
  ["Three", "3"],
  ["3", "3"],
  ["four", "4"],
  ["Four", "4"],
  ["4", "4"],
  ["five", "5"],
  ["Five", "5"],
  ["5", "5"],
  ["six", "6"],
  ["Six", "6"],
  ["6", "6"],
  ["seven", "7"],
  ["Seven", "7"],
  ["7", "7"],
  ["eight", "8"],
  ["Eight", "8"],
  ["8", "8"],
  ["nine", "9"],
  ["Nine", "9"],
  ["9", "9"],
  ["ten" , "T"],
  ["Ten" , "T"],
  ["10" , "T"],
  ["jack" , "J"],
  ["Jack" , "J"],
  ["11" , "J"],
  ["queen" , "Q"],
  ["Queen" , "Q"],
  ["12" , "Q"],
  ["king" , "K"],
  ["King" , "K"],
  ["13" , "K"],
]);

const suitMap = new Map([
  ["Hearts", 'H'],
  ['Diamonds', 'D'],
  ['Clubs', 'C'],
  ["Spades", 'S'],
]);

function Card({rank, suit,user,room,socket}) {

  const handleClick = () =>{
    
    if(room !== undefined){
      console.log(user,"clicked", rank,suit)
      console.log("room",room)
      console.log(user)
      socket.emit("action",{
        "action":"draw",
        "player":user,
        "card":{
          "rank":rank,
          "suit":suit
        },
        "room":room
      })
    }
    else
      console.log("user is undefined")  
    
    
  }

  return (
    <div style={{display:'grid',justifyContent:'center'}}
        onClick={handleClick}>
      <img
        alt={rank + 'of' + suit} 
        src={`/cards/${rankMap.get(rank)}${suitMap.get(suit)}.svg`} 
        style={{width:'120px'}} 
      />
    </div>
   )
}

export default Card;
