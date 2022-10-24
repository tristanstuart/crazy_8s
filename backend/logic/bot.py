import random
from .player import Player

class Bot(Player):
    def __init__(self, name):
        super().__init__(name)

    def chooseSuit(self):
        suits = ["Diamonds","Hearts","Clubs","Spades"]
        suit = random.choice(suits)
        return suit
    
    def player_turn(self, up_card,deck,pile,activeSuit):
        options = []
        
        for i in range(len(self.cards)):

            if self.cards[i].rank == '8':
                
                pile.insert(0,self.cards.pop(i))
                
                print("   Computer played " + pile[0].short_name)
                activeSuit = self.chooseSuit()
                pile[0].suit = activeSuit

                print("   Computer changed suit to " + activeSuit)
                return

            else:
                if (self.cards[i].suit == up_card.suit) or (self.cards[i].rank == up_card.rank):
                    options.append(self.cards[i])

        if len(options) > 0:
        
            card2Remove = options.pop(random.randrange(len(options)))
            for i in range(len(self.cards)):
                if self.cards[i] == card2Remove:
                    pile.insert(0,self.cards.pop(i))
                    break;
            
            activeSuit = pile[0].suit
            print("   Computer played " + pile[0].short_name)
            return
        else:
            if len(deck) > 0:
                
                self.cards.append(deck.pop())
                print( "  Computer drew a card.")
