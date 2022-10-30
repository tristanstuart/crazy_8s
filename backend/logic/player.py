from .cards import Card
class Player():
    def __init__(self, info) -> None:
        print("info",info)
        self.info = info
        self.cards = []

    def __repr__(self):
        return self.getName() + " (" + self.getSID() + ")"

    def getName(self):
        return self.info['name']

    def getSID(self):
        return self.info['sid']

    def getCards(self):
        cards = {"hand":[]}
        for card in self.cards:
            cards["hand"].append({
                "rank":card.rank,
                "suit":card.suit
            })
        return cards