from random import shuffle

from flask import jsonify

from logic.cards import Card
from logic.deck import Deck
from logic.player import Player
from logic.bot import Bot

from flask_socketio import *

import json

import pickle

class Game():
    def __init__(self,data) -> None:
        self.deck = Deck().init_cards().copy()
        self.pile = []
        self.players = {"players":self.getPlayers(data)}
        self.upCard = None
        self.activeSuit = ""

    def getPlayers(self,data):
        playerList ={}
        print("here are your players",data)
        for player in data["players"]:
            print(player["username"])
            playerList[player["username"]] = (Player(player["username"]))

        if len(playerList) < 2:
            playerList["Bot"] = Bot("Bot")

        return playerList
             

    def shuffleDeck(self):
        shuffle(self.deck)

    def dealCards(self):
        cards =[]
        print("dealCards",self.players["players"]["marco"])
        for player in self.players["players"]:
            for i in range(5):
                cards.append(self.deck.pop())
            self.players["players"][player].cards = cards.copy()
            cards.clear()
        print("imoverhere")
        
        print(len(self.players["players"]["marco"].coco))
        # # jsonstring = jsonify(useranme="stuff")
        # emit("response",str(self.players["players"]["marco"].cards[0]))
        cards = ""
        for card in self.players["players"]["marco"].cards:
            cards += card.shortname + " "
        emit("dealtCards",cards)

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
        self.shuffleDeck()
        self.dealCards()

        print(self.players)
        self.pile.insert(0,self.deck.pop())
        self.activeSuit = self.pile[0].suit
        
        while not done:

            for player in self.players["players"]:
               
                self.upCard = self.pile[0];
                self.activeSuit = self.upCard.suit;

                print("   Up card:", self.upCard.long_name)
                print("   Suit is " + self.activeSuit)

                self.players["players"][player].player_turn(self.upCard,self.deck,self.pile,self.activeSuit)
                
                if len(self.players["players"][player].cards) == 0:
                    print(self.players["players"][player].name + " Won!")
                    done = True;
                    break;

                if len(self.deck) == 0:
                    done = self.reShuffle();
                    if done:
                        print("No one wins")
                        break;
                
                    


