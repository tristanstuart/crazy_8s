
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
  ["Jack" , "J"],
  ["jack" , "J"],
  ["11" , "J"],
  ["Queen" , "Q"],
  ["queen" , "Q"],
  ["12" , "Q"],
  ["King" , "K"],
  ["king" , "K"],
  ["13" , "K"],
]);

const suitMap = new Map([
  ["Hearts", 'H'],
  ['Diamonds', 'D'],
  ['Clubs', 'C'],
  ["Spades", 'S'],
]);

function Card({rank, suit,room,socket,class_}) {
  const handleClick = () =>{
    if(room !== undefined){
        socket.emit("deal",{
          "card":{
            "rank":rank,
            "suit":suit
          },
          "room":room,
          ID:JSON.parse(sessionStorage.getItem("session")).ID
        })  
    }
  }
  
  return (
    <div 
        className={class_}
        style={{width:"120px"}}
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
