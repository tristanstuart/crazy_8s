from random import shuffle, randint
import json
from .cards import Card
from .deck import Deck
from .player import Player
from .bot import Bot

class Game():
    def __init__(self, admin) -> None:
        self.deck = Deck().init_cards().copy()
        self.pile = []
        self.players = [Player(admin)]
        self.admin = admin
        self.activeSuit = ""
        self.playerTurn = None
        self.index = None
        self.needSuit = False
        self.gameOver = False

    def status(self):
        status = {
            "players":[],
        }
        for player in self.players:
            status["players"].append({player.getName():player.getCards()})       
        status["updateDisplay"] = self.updateDisplay()
        status["deck"] = len(self.deck)
        status["pile"] = len(self.pile)
        status["chooseSuit"] = self.needSuit
        
        return status


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
        self.shuffleDeck()
        self.dealCards()

        self.pile.insert(0,self.deck.pop())
        self.activeSuit = self.pile[0].suit
        print(f"roll random between 0 and {len(self.players) - 1} to determine starting player")
        self.index = randint(0, len(self.players) - 1)
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
        if len(self.deck) == 0:
            #if false then there is only one card in the pile and users are hoarding cards
            if self.reShuffle():
                print("gameOver")
                self.gameOver=True
                return False
        
        self.playerTurn.cards.append(self.deck.pop())
        return True
    
    def dealCard(self,rank,suit):
        
        if  rank == "8" or rank == self.upcard().rank or suit == self.activeSuit:
            for i in range(len(self.playerTurn.cards)):
                #look for the matching card
                if self.playerTurn.cards[i].rank == rank and self.playerTurn.cards[i].suit == suit:
                    self.pile.insert(0,self.playerTurn.cards.pop(i))
                    if rank =="8":
                        self.needSuit = True
                        return "choose suit"
                    if rank == "Queen":
                        return "skip"
                    if rank == "2":
                        return "draw2"
                    self.activeSuit = self.pile[0].suit
                    break
            return "next"
        return "error"

    # return updated center display
    def updateDisplay(self, rule=None):
        winner = ""
        if self.gameOver == True:
            winner = self.playerTurn.getName()

        display = {
            "upcard":{
                "rank":self.upcard().rank,
                "suit":self.upcard().suit
                },
            "currentTurn":self.playerTurn.getName(),
            "nextTurn":self.getNext(),
            "activeSuit":self.activeSuit,
            "winner":winner,
            'rule': ''
        }
        if rule:
            if rule == 'skip': 
                display['nextTurn'] = self.playerTurn.getName()
            
            display['rule'] = rule
        
        return display

    #get the next player's name
    def getNext(self):
        if self.needSuit == True:
            return self.playerTurn.getName()
        if self.index + 1 == len(self.players):
            return self.players[0].getName()
        return self.players[self.index+1].getName()        

    #update current player cards, and center display
    # overloaded function
    def render(self, rule=None):
        return {"updateDisplay":self.updateDisplay(rule),"updateHand":self.playerTurn.getCards()}
    # set the next players turn
    def nextTurn(self):
        if self.index + 1 == len(self.players):
            self.index = 0
        else:
            self.index +=1
        self.playerTurn = self.players[self.index]

    # check if the game should end
    def endGame(self):
        if len(self.playerTurn.cards) == 0:
            return True
        return False

    #just sets suit chosen
    def setSuit(self,suit):
        self.needSuit = False
        self.activeSuit = suit
        return self.render()
            
    def draw(self):
    
        if self.needSuit == True:
            return "error","Please select a suit"
        
        if self.drawCard() == False:
            self.gameOver = True
            return "error","There are no more cards to draw"     
                
        return "next",self.render()        

    def deal(self,data):
        if self.needSuit == True:
            return "error","Please select a suit"

        result = self.dealCard(data["card"]["rank"],data["card"]["suit"]) 
        
        #checks if the curr user has an empty hand, if so they win
        if self.endGame():
            self.gameOver = True
            return "winner",self.render()

        if result == "next":
            #update userCards, and center display
            return "next",self.render()
        # user dealt an eight card, and a new suit is required from them
        elif result == "choose suit":
            return "choose suit", self.render()
        elif result == "skip":
            return "skip",self.render('skip')
        elif result == "draw2":
            return "next", self.render('draw2')
        # current user dealt a card with no matching rank/suit
        elif result == "error":
            return "error","Cards do not match"
    

