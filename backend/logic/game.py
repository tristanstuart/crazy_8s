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
        self.gameOver = False;

    def status(self):
        status = {
            "players":[],
        }
        for player in self.players:
            status["players"].append({player.getName():player.getCards()})       
        status["update"] = self.update()
        status["deck"] = len(self.deck)
        status["pile"] = len(self.pile)
        status["chooseSuit"] = self.needSuit
        status["currentTurn"] = self.playerTurn.getName()
        status["nextTurn"] = self.getNext()
        
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
                return False
        
        self.playerTurn.cards.append(self.deck.pop())
        return True
    
    def deal(self,rank,suit):
        
        if  rank == "8" or rank == self.upcard().rank or suit == self.activeSuit:
            
            for i in range(len(self.playerTurn.cards)):
                #look for the matching card
                if self.playerTurn.cards[i].rank == rank and self.playerTurn.cards[i].suit == suit:
                    self.pile.insert(0,self.playerTurn.cards.pop(i))
                    if rank =="8":
                        self.needSuit = True
                        return "choose suit"
                    
                    self.activeSuit = self.pile[0].suit
                    break
            
            return "next"
        
        return "error"

    # return updated center display
    def update(self):
        return {
            "upcard":{
                "rank":self.upcard().rank,
                "suit":self.upcard().suit
                },
            "currentTurn":self.playerTurn.getName(),
            "nextTurn":self.getNext(),
            "activeSuit":self.activeSuit
        }
    
    #get the next player's name
    def getNext(self):
        if self.needSuit == True:
            return self.playerTurn.getName()
        if self.index + 1 == len(self.players):
            return self.players[0].getName()
        return self.players[self.index+1].getName()        

    #update current player cards, and center display
    def render(self):
        return {"updateDisplay":self.update(),"userCards":self.playerTurn.getCards()}

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
    
    #handles evething so far, which is bad
    def action(self,data):
        
        #if the player dealt an 8 card, then its expected they cant deal/draw
        if self.needSuit == False:
            if data["action"] == "draw":
                
                #cant decide if this should end the game or not
                # if its false then there are no more cards in the deck and the pile only has one card
                # assuming players are hoarding cards
                if self.drawCard() == False:
                    return "end","There are no more cards to draw"     
                
                #update userCards, and center display
                return "next",self.render()

            elif data["action"] == "deal":
            
                result = self.deal(data["card"]["rank"],data["card"]["suit"]) 
                
                #user was able to deal a card succesfully
                if  result == "next":

                    #checks if the curr user has an empty hand, if so they win
                    if self.endGame():
                        message = {
                            "winner":data["player"],
                            "data":self.render()
                        }
                        self.gameOver = True;
                        return "end",message

                    #update userCards, and center display
                    return "next",self.render()
                # user dealt an eight card, and a new suit is required from them
                elif result == "choose suit":

                    return "choose suit", self.render()
                # current user dealt a card with no matching rank/suit
                elif result == "error":
                    return "error","Cards do not match"
            #being passed an unknown action
            else:
                return "error", "unknown action"

        else:
            #if the user decided to deal/draw, when a suit is expected: return this error message
            if data["action"] != "choose suit":
                return "error","Please select a suit"
            
            self.setSuit(data["suit"])
            return "next",self.render()
            
            