const heartsMap = new Map([
  ["Two", "🂲"],//🃑 
  ["Three", "🂳"],
  ["Four", "🂴"],
  ["Five", "🂵"],
  ["Six", "🂶"],
  ["Seven", "🂷"],
  ["Eight", "🂸"],
  ["Nine", "🂹"],
  ["Ten", "🂺"],
  ["Jack", "🂻"],
  ["Queen", "🂽"],
  ["King", "🂾"],
  ["Ace", "🂱"]
]);

const diamondsMap = new Map([
  ["Two", "🃂"],
  ["Three", "🃃"],
  ["Four", "🃄"],
  ["Five", "🃅"],
  ["Six", "🃆"],
  ["Seven", "🃇"],
  ["Eight", "🃈"],
  ["Nine", "🃉"],
  ["Ten", "🃊"],
  ["Jack", "🃋"],
  ["Queen", "🃍"],
  ["King", "🃎"],
  ["Ace", "🃁"]
]);

const spadesMap = new Map([
  ["Two", "🂢"],
  ["Three", "🂣"],
  ["Four", "🂤"],
  ["Five", "🂥"],
  ["Six", "🂦"],
  ["Seven", "🂧"],
  ["Eight", "🂨"],
  ["Nine", "🂩"],
  ["Ten", "🂪"],
  ["Jack", "🂫"],
  ["Queen", "🂭"],
  ["King", "🂮"],
  ["Ace", "🂡"]
]);

const clubsMap = new Map([
  ["Two", "🃒"],
  ["Three", "🃓"],
  ["Four", "🃔"],
  ["Five", "🃕"],
  ["Six", "🃖"],
  ["Seven", "🃗"],
  ["Eight", "🃘"],
  ["Nine", "🃙"],
  ["Ten", "🃚"],
  ["Jack", "🃛"],
  ["Queen", "🃝"],
  ["King", "🃞"],
  ["Ace", "🃑"]
]);

function getCharacterMapBySuite(suite) {
  switch (suite) {
    case "Diamonds":
      return diamondsMap;
    case "Spades":
      return spadesMap;
    case "Clubs":
      return clubsMap;
    case "Hearts":
    default:
      return heartsMap;
  }
}

function color(suite){
  var c;
  if((suite === "Hearts") || (suite === "Diamonds")){
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
  console.log(rank, suite);
  return (
    <div className={c}>
        {map.get(rank)}
    </div>
   )
}

export default Card;
