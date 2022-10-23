const heartsMap = new Map([
  ["ace", "🂱"],
  ["1", "🂱"],
  ["two", "🂲"],
  ["2", "🂲"],
  ["three", "🂳"],
  ["3", "🂳"],
  ["four", "🂴"],
  ["4", "🂴"],
  ["five", "🂵"],
  ["5", "🂵"],
  ["six", "🂶"],
  ["6", "🂶"],
  ["seven", "🂷"],
  ["7", "🂷"],
  ["eight", "🂸"],
  ["8", "🂸"],
  ["nine", "🂹"],
  ["9", "🂹"],
  ["ten", "🂺"],
  ["10", "🂺"],
  ["jack", "🂻"],
  ["11", "🂻"],
  ["queen", "🂽"],
  ["12", "🂽"],
  ["king", "🂾"],
  ["13", "🂾"],
]);

const diamondsMap = new Map([
  ["ace", "🃁"],
  ["1", "🃁"],
  ["two", "🃂"],
  ["2", "🃂"],
  ["three", "🃃"],
  ["3", "🃃"],
  ["four", "🃄"],
  ["4", "🃄"],
  ["five", "🃅"],
  ["5", "🃅"],
  ["six", "🃆"],
  ["6", "🃆"],
  ["seven", "🃇"],
  ["7", "🃇"],
  ["eight", "🃈"],
  ["8", "🃈"],
  ["nine", "🃉"],
  ["9", "🃉"],
  ["ten", "🃊"],
  ["10", "🃊"],
  ["jack", "🃋"],
  ["11", "🃋"],
  ["queen", "🃍"],
  ["12", "🃍"],
  ["king", "🃎"],
  ["13", "🃎"],
]);

const spadesMap = new Map([
  ["ace", "🂡"],
  ["1", "🂡"],
  ["two", "🂢"],
  ["2", "🂢"],
  ["three", "🂣"],
  ["3", "🂣"],
  ["four", "🂤"],
  ["4", "🂤"],
  ["five", "🂥"],
  ["5", "🂥"],
  ["six", "🂦"],
  ["6", "🂦"],
  ["seven", "🂧"],
  ["7", "🂧"],
  ["eight", "🂨"],
  ["8", "🂨"],
  ["nine", "🂩"],
  ["9", "🂩"],
  ["ten", "🂪"],
  ["10", "🂪"],
  ["jack", "🂫"],
  ["11", "🂫"],
  ["queen", "🂭"],
  ["12", "🂭"],
  ["king", "🂮"],
  ["13", "🂮"],
]);

const clubsMap = new Map([
  ["ace", "🃑"],
  ["1", "🃑"],
  ['two', "🃒"],
  ['2', "🃒"],
  ["three", "🃓"],
  ["3", "🃓"],
  ["four", "🃔"],
  ["4", "🃔"],
  ["five", "🃕"],
  ["5", "🃕"],
  ["six", "🃖"],
  ["6", "🃖"],
  ["seven", "🃗"],
  ["7", "🃗"],
  ["eight", "🃘"],
  ["8", "🃘"],
  ["nine", "🃙"],
  ["9", "🃙"],
  ["ten" , "🃚"],
  ["10" , "🃚"],
  ["jack" , "🃛"],
  ["11" , "🃛"],
  ["queen" , "🃝"],
  ["12" , "🃝"],
  ["king" , "🃞"],
  ["13" , "🃞"],
]);

function getCharacterMapBySuite(suite) {
  switch (suite) {
    case "diamonds":
      return diamondsMap;
    case "spades":
      return spadesMap;
    case "clubs":
      return clubsMap;
    case "hearts":
    default:
      return heartsMap;
  }
}

function color(suite){
  var c;
  if((suite === "hearts") || (suite === "diamonds")){
    c = "text-red-500 text-9xl"
  }
  else {
    c = "text-9xl"
  }
  return c;
}

function Card({rank, suite}) {
  const map = getCharacterMapBySuite(suite);
  const c = color(suite);
  return (
    <div className={c}>
        {map.get(rank)}
    </div>
   )
}

export default Card;
