from random import shuffle
from logic.cards import Card
from logic.deck import Deck
from logic.player import Player
from logic.bot import Bot

class Game():
    def __init__(self) -> None:
        self.deck = Deck().init_cards().copy()
        self.pile = []
        self.players = []
        self.upCard = None
        self.activeSuit = ""

    def shuffleDeck(self):
        shuffle(self.deck)

    def dealCards(self):
        cards =[]
        for player in self.players:
            for i in range(5):
                cards.append(self.deck.pop())
            player.cards = cards.copy()
            cards.clear()

    def getPlayers(self):
        numPlayers = input("How many players will play? ")
        while not numPlayers.isnumeric():
            numPlayers = input("Input a valid player amount: ")

        numPlayers = int(numPlayers)
        for i in range(1,1+numPlayers):
            name = input("   Player " + str(i) + "'s name: ")
            self.players.append(Player(name));

        if numPlayers == 1:
            self.players.append(Bot("Bot"))

    def reShuffle(self):
        
        if len(self.pile) == 1:
            return True
        
        topCard = self.pile[0];
        for i in range(1,len(self.pile)):
            self.deck.append(self.pile[i])
        
        self.pile.clear()
        self.pile.append(topCard)
        self.shuffleDeck();

        return False;

    def gameStart(self):

        done = False
    
        self.getPlayers()
        self.shuffleDeck()
        self.dealCards()

        self.pile.insert(0,self.deck.pop())
        self.activeSuit = self.pile[0].suit
        
        while not done:

            for player in self.players:
               
                self.upCard = self.pile[0];
                self.activeSuit = self.upCard.suit;

                print("   Up card:", self.upCard.long_name)
                print("   Suit is " + self.activeSuit)

                player.player_turn(self.upCard,self.deck,self.pile,self.activeSuit)
                
                if len(player.cards) == 0:
                    print(player.name + " Won!")
                    done = True;
                    break;

                if len(self.deck) == 0:
                    done = self.reShuffle();
                    if done:
                        print("No one wins")
                        break;
                
                    


