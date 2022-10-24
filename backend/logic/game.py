from random import shuffle, randint
import json
from .cards import Card
from .deck import Deck
from .player import Player
from .bot import Bot

class Game():
    def __init__(self, admin) -> None:
        print("admin",admin)
        self.deck = Deck().init_cards().copy()
        self.pile = []
        self.players = [Player(admin)]
        self.admin = admin
        self.activeSuit = ""
        self.playerTurn = None

    def shuffleDeck(self):
        shuffle(self.deck)

    def dealCards(self):
        cards =[]
        for player in self.players:
            for i in range(5):
                cards.append(self.deck.pop())
            player.cards = cards.copy()
            cards.clear()

    def reShuffle(self):
        
        if len(self.pile) == 1:
            return True
        
        topCard = self.pile[0]
        for i in range(1,len(self.pile)):
            self.deck.append(self.pile[i])
        
        self.pile.clear()
        self.pile.append(topCard)
        self.shuffleDeck()

        return False

    def gameStart(self):
        print("players in gameStart",self.players)
        print("")
        self.shuffleDeck()
        self.dealCards()

        self.pile.insert(0,self.deck.pop())
        self.activeSuit = self.pile[0].suit
        print(f"roll random between 0 and {len(self.players) - 1} to determine starting player")
        self.playerTurn = self.players[randint(0, len(self.players) - 1)]
    
    def upcard(self):
        return self.pile[0]

    def getAdmin(self):
        return self.admin

    def __repr__(self):
        playerStr = ""
        for p in self.players:
            playerStr = playerStr + "\n\t  " + repr(p)
        return "\n\tAdmin:\n\t  " + self.admin['name'] + " (" + str(self.admin['sid']) + ")\n\tPlayers:" + playerStr + "\n\tStarted: " + "no" if self.activeSuit == "" else "yes"

    def addPlayer(self, playerInfo):
        self.players.append(Player(playerInfo))
    
    def playerExists(self, playerInfo): # !!playerInfo is not a Player object!!
        for p in self.players:
            if p.getName() == playerInfo['name']:
                return True
        return False
    
    def playerList(self):
        allPlayers = []
        for p in self.players:
            allPlayers.append(p.getName())
        print(allPlayers)
        return allPlayers

    def getCardState(self, player):
        playerCards = []
        opponents = []
        for p in self.players:
            if player.getName() == p.getName():
                for card in p.cards:
                    playerCards.append(card.toDict())
            else:
                opponents.append({'name':p.getName(), 'count':len(p.cards)})
        return playerCards, opponents
    
    def getPlayerTurn(self):
        return self.playerTurn

    def action(self,data):
        print("heya cunfadsfa",self.playerTurn.getName())
        if self.playerTurn.getName() == data["player"]:
            print("data in action",data)
            if data["action"] == "draw":
                print(data["player"],"wants to draw")
            elif data["action"] == "deal":
                print(data["player"],"wants to deal")
            else:
                print("unknown action")
        else:
            return 
            print(data["player"],"it is not your turn")