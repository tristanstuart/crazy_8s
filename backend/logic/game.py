from random import shuffle

from logic.cards import Card
from logic.deck import Deck
from logic.player import Player
from logic.bot import Bot

from flask_socketio import *

class Game():
    def __init__(self,data) -> None:
        self.deck = Deck().init_cards().copy()
        self.pile = []
        self.players = self.getPlayers(data)
        self.upCard = None
        self.activeSuit = ""
        self.nextPlayer = 0


    def getPlayers(self,data):
        
        playerList =[]
        print("here are your players",data)
        for player in data:
            print(player["username"])
            playerList.append(Player(player["username"]))

        if len(playerList) < 2:
            playerList.append(Bot("Bot"))
        self.nextPlayer = 0

        return playerList
    
    def status(self):
        players = {}
        for player in self.players:
            players[player.name] = player.returnCards()

        deckcards = []
        for card in self.deck:
            deckcards.append(card.shortname)

        players["deck"] = deckcards

        deckcards = []
        for card in self.pile:
            deckcards.append(card.shortname)
        
        players["pile"] = deckcards

        players["upCard"] = self.upCard.shortname
        players["activeSuit"] = self.activeSuit[0]

        return players


    def shuffleDeck(self):
        shuffle(self.deck)

    def dealCards(self):
        cards =[]
    
        self.pile.insert(0,self.deck.pop())
        self.upCard = self.pile[0]
        self.activeSuit = self.upCard.suit

        emit("newDisplay",{
            "upCard":self.upCard.shortname,
            "activeSuit":self.activeSuit[0]
        })

        for player in self.players:
            for i in range(5):
                cards.append(self.deck.pop())
            player.cards = cards.copy()
            cards.clear()
            
            #return cards to specific player specified by name
            emit(player.name,player.returnCards())

        emit("status",self.status())
        

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

    def start(self):
        self.shuffleDeck()
        self.dealCards()
        return self.getPlayers()

    


    # def gameStart(self):
    #     print("hello")
    #     done = False
    #     self.shuffleDeck()
    #     self.dealCards()
        
    #     print(self.players)
    #     self.pile.insert(0,self.deck.pop())
    #     self.activeSuit = self.pile[0].suit
    #     # emit("response",self.status())
        
    #     while not done:
    #         for player in self.players:
    #             self.upCard = self.pile[0]
    #             self.activeSuit = self.upCard.suit
    #             print("   Up card:", self.upCard.long_name)
    #             print("   Suit is " + self.activeSuit)
                
    #             emit("newDisplay",{
    #                 "upCard":self.upCard.shortname,
    #                 "activeSuit":self.activeSuit[0]
    #             })

    #             self.players[player].player_turn(self.upCard,self.deck,self.pile,self.activeSuit)
                
    #             if len(self.players[player].cards) == 0:
    #                 print(self.players[player].name + " Won!")
    #                 done = True
    #                 break

    #             if len(self.deck) == 0:
    #                 done = self.reShuffle()
    #                 if done:
    #                     print("No one wins")
    #                     break

    def gameStart(self):
        print("gameStart")
        self.shuffleDeck()
        self.dealCards()
    
    def nextTurn(self):
        if self.nextPlayer + 1>= len(self.players):
            self.nextPlayer = 0
        else:
            self.nextPlayer += 1
        
    def draw(self):
        self.players[self.nextPlayer].cards.append(self.deck.pop())
        print(self.players[self.nextPlayer].returnCards())

    def deal(self):
        #needs to be finished
        pass


    def action(self,user,action,card):
        if self.players[self.nextPlayer].name == user:
            if action == "draw":
                print(action)
                self.draw()
                emit(self.players[self.nextPlayer].name,self.players[self.nextPlayer].returnCards())
                
                self.nextTurn()
                
                if self.players[self.nextPlayer].name == "Bot":
                    self.players[self.nextPlayer].player_turn(self.upCard,self.deck,self.pile,self.activeSuit)
                
                self.upCard = self.pile[0]
                self.activeSuit = self.upCard.suit
                
                emit("newDisplay",{
                     "upCard":self.upCard.shortname,
                     "activeSuit":self.activeSuit[0]
                })
                self.nextTurn()
            
            elif action == "deal":
                #needs to be finished
                print("finish deal function")    
                pass


            emit("status",self.status())
            
        else:
            print(user,"it is not your turn")
    