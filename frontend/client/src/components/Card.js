const rankMap = new Map([
  ["ace", "A"],
  ["1", "A"],
  ['two', "2"],
  ['2', '2'],
  ["three", "3"],
  ["3", "3"],
  ["four", "4"],
  ["4", "4"],
  ["five", "5"],
  ["5", "5"],
  ["six", "6"],
  ["6", "6"],
  ["seven", "7"],
  ["7", "7"],
  ["eight", "8"],
  ["8", "8"],
  ["nine", "9"],
  ["9", "9"],
  ["ten" , "T"],
  ["10" , "T"],
  ["jack" , "J"],
  ["11" , "J"],
  ["queen" , "Q"],
  ["12" , "Q"],
  ["king" , "K"],
  ["13" , "K"],
]);

const suitMap = new Map([
  ['hearts', 'H'],
  ['diamonds', 'D'],
  ['clubs', 'C'],
  ['spades', 'S'],
]);

function Card({rank, suits}) {
  return (
    <div style={{display:'grid',justifyContent:'center'}}>
      <img  
        src={`/cards/${rankMap.get(rank.toLowerCase())}${suitMap.get(suits.toLowerCase())}.svg`} 
        style={{width:'120px'}} 
      />
    </div>
   )
}

export default Card;
