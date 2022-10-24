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
        self.index = None
        self.needSuit = False

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
        self.index = randint(0, len(self.players) - 1)
        print(self.index)
        self.playerTurn = self.players[self.index]

    
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

    def drawCard(self):
        print(len(self.playerTurn.cards))
        if len(self.deck) == 0:
            if self.reShuffle():
                print("gameOver")
                return False
        
        self.playerTurn.cards.append(self.deck.pop())
        print(len(self.playerTurn.cards))
        return True

    def deal(self,rank,suit):
        
        if  rank == "8" or rank == self.upcard().rank or suit == self.upcard().suit:
            print(rank,suit,"matches up card",self.upcard())
            for i in range(len(self.playerTurn.cards)):
                if self.playerTurn.cards[i].rank == rank and self.playerTurn.cards[i].suit == suit:
                    self.pile.insert(0,self.playerTurn.cards.pop(i))
                    if rank =="8":
                        self.needSuit = True
                        return "choose suit"
                    
                    self.activeSuit = self.pile[0].suit
                    break

            return "next"
        
        return "error"

    def update(self):
        return {
            "upcard":{
                "rank":self.upcard().rank,
                "suit":self.upcard().suit
                },
            "turn":self.getNext()
        }
    
    def getNext(self):
        if self.needSuit == True:
            return self.playerTurn.getName()
        if self.index + 1 == len(self.players):
            return self.players[0].getName()
        return self.players[self.index+1].getName()        


    def render(self):
        return {"updateDisplay":self.update(),"userCards":self.playerTurn.getCards()}

    def nextTurn(self):
        if self.index + 1 == len(self.players):
            self.index = 0
        else:
            self.index +=1
        self.playerTurn = self.players[self.index]

    def endGame(self):
        if len(self.playerTurn.cards) == 0:
            return True
        return False

    def setSuit(self,suit):
        self.needSuit = False
        self.activeSuit = suit
        

    #spilt this up
    #implement choosing suit func for crazy eight
    def action(self,data):
       
        if self.playerTurn.getName() == data["player"]:
            
            if data["action"] == "draw":
            
                if self.drawCard() == False:
                    return "noCards","there are no more cards to draw"               
                return "drawed",self.render()

            elif data["action"] == "deal":
            
                result = self.deal(data["card"]["rank"],data["card"]["suit"]) 
                
                if  result == "next":

                    if self.endGame():
                        message = {
                            "winner":data["player"],
                            "data":self.render()
                        }
                        return "end",message

                    return "next",self.render()
                
                elif result == "choose suit":
                    
                    return "choose suit", self.render()
                    
                elif result == "error":
                    return "error","cards do not match"
            
            elif data["action"] == "choose suit":
                self.setSuit(data["suit"])
                print("am i in here")
                print(self.render())
                return "next",self.render()
            
            else:
                print("unknown action")
        
        else:
            return "error","it is not your turn"
            
            