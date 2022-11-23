from random import shuffle, randint
from .deck import Deck
from .player import Player
from .Rules import Rules

class Game():
    def __init__(self, admin) -> None:
        self.deck = Deck().init_cards().copy()
        self.pile = []
        self.players = [Player(admin)]
        self.num_players = 1
        self.admin = admin
        self.activeSuit = ""
        self.playerTurn = None
        self.index = None
        self.needSuit = False
        self.gameOver = False
        self.inSession = False
        
    def hasStarted(self):
        return self.inSession
        
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
        self.inSession = True
         
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
        self.num_players += 1
    
    def playerExists(self, playerInfo): # !!playerInfo is not a Player object!!
        for p in self.players:
            if p.getName() == playerInfo['name']:
                return True
        return False
    
    def playerList(self):
        allPlayers = []
        allIcons = {}
        for p in self.players:
            allPlayers.append(p.getName())
            allIcons[p.getName()] = p.getIcon()
        return {"players":allPlayers, "icons":allIcons}

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

    # return updated center display
    def updateDisplay(self, rule=None):
        winner = ""
        if self.gameOver == True:
            winner = self.playerTurn.getName()

        display = {
            "upCard":{
                "rank":self.upcard().rank,
                "suit":self.upcard().suit
                },
            "currentTurn":self.playerTurn.getName(),
            "nextTurn":self.getNext(),
            "activeSuit":self.activeSuit,
            "winner":winner,
            'rule': rule
        }
        
        
        return display

    #get the next player's name
    def getNext(self,over=None):
        
        if self.index == len(self.players):
            self.index -= 1

        if len(self.players) == 0:
            return "no more players"

        if self.needSuit == True:
            return self.playerTurn.getName()
        
        if self.index + 1 == len(self.players):
            return self.players[0].getName()

        return self.players[self.index+1].getName()        

    #update current player cards, and center display
    # overloaded function
    def render(self, rule=None):
        if rule == "skip":
            current_players_hand = self.playerTurn.getCards()
            display = self.updateDisplay(rule)
            self.nextTurn()
            display = self.updateDisplay(rule)
            self.nextTurn()
            return {
                "updateDisplay":display,
                "updateHand":current_players_hand
            }
        return {"updateDisplay":self.updateDisplay(rule),
                "updateHand":self.playerTurn.getCards()
                }
    
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
        update = self.render()
        self.nextTurn()
        return update
            
    def draw(self):
        if self.needSuit: 
            return Rules.CHOOSE_SUIT, None
        
        if self.drawCard() == False:
            self.gameOver = True
            return Rules.ERROR, None   
                
        return Rules.VALID, self.render()  

    def drawCard(self):
        if len(self.deck) == 0:
            #if false then there is only one card in the pile and users are hoarding cards
            if self.reShuffle():
                print("gameOver")
                self.gameOver=True
                return False
        
        self.playerTurn.cards.append(self.deck.pop())
        return True      

    def play_card(self,data):
        if self.needSuit == True:
            return "error","Please select a suit"

        result = self.verify_card_played( 
                                rank = data["card"]["rank"],
                                suit = data["card"]["suit"] 
                                ) 
        
        #checks if the curr user has an empty hand, if so they win
        if self.endGame():
            self.gameOver = True
            return Rules.WINNER,self.render()

        # current user dealt a card with no matching rank/suit
        elif result is Rules.ERROR: 
            print('expected rank or suit: ' + self.activeSuit + '-' + self.upcard().rank)
            print('recieved: rank and suit ', data["card"]["rank"] + ' of ' + data["card"]["suit"])
            return Rules.ERROR, "cards do not match"

        elif result is Rules.VALID:
            update = self.render() #update userCards, and center display

        # user dealt an eight card, and a new suit is required from them
        elif result is Rules.CHOOSE_SUIT: 
            update = self.render()
            return Rules.CHOOSE_SUIT, update
        # Queen was played and next player is skipped 
        # call next turn twice to update server side ?
        elif result is Rules.SKIP:
            update = self.render('skip')
            return result, update

        elif result is Rules.DRAW2:
            update = self.render('draw2')
            
        elif result is Rules.REVERSE:
            current_player = self.players[self.index]
            print('\n',self.players[self.index], '\n')
            self.players.reverse()
            self.index = self.players.index(current_player)
            print('\n',self.players[self.index], '\n')
            update = self.render('reverse')

        self.nextTurn()
        return None, update

    def verify_card_played(self,rank,suit):
        
        if  ( rank == "8" or
              rank == self.upcard().rank or 
              suit == self.activeSuit):

            for i in range(len(self.playerTurn.cards)):
                #looks for the matching card to remove from players hand
                if self.playerTurn.cards[i].rank == rank and self.playerTurn.cards[i].suit == suit:
                    self.pile.insert(0,self.playerTurn.cards.pop(i))
                    self.activeSuit = self.pile[0].suit
                    if rank =="8":
                        self.needSuit = True
                        return Rules.CHOOSE_SUIT
                    if rank == "Queen":
                        return Rules.SKIP
                    if rank == "2":
                        return Rules.DRAW2
                    if rank == "Ace":
                        return Rules.REVERSE
                    break
            return Rules.VALID
        
        return Rules.ERROR

    def removePlayer(self,data):
        ID = data["ID"]
        #if the game hasn't started no prob just remove the player
        if not data["inSession"]:
            for p in range(len(self.players)):
                if self.players[p].getSID() == ID:
                    self.players.pop(p)
                    return
    
        player = None
        
        #look for player
        for i in range(len(self.players)):
            if self.players[i].getSID() == ID:
                player = self.players.pop(i)
                break
    
        #if the player leaving is the current expected player , just set to the next player
        if self.playerTurn.getSID() == player.getSID():
            self.index-=1
            self.nextTurn()
        
        for i in range(len(player.cards)):
            self.deck.append(player.cards.pop())
        self.shuffleDeck()
        del(player)

    def reset(self):
        for p in self.players:
            p.cards.clear()
        self.deck = Deck().init_cards().copy()
        self.pile = []
        self.activeSuit = ""
        self.playerTurn = None
        self.index = None
        self.needSuit = False
        self.gameOver = False
        self.inSession = False