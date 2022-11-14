import pytest
import sys

sys.path.insert(0,'..')

from logic.game import Game
from logic.cards import Card
from logic.Rules import Rules

def setup_game():
    game = Game({'name':"admin", 'sid':"0"})
    for i in range(3):
        game.addPlayer({'name':"player" + str(i), 'sid':str(i+1)})
    game.gameStart()
    return game

def test_verify_card_played():
    game = setup_game()
    suit = game.upcard().suit_id
    # player hand         =  8 of suit,     Queen of suit,  2 of suit,     Ace of suit,   3 of suit,     invalid card
    game.playerTurn.cards = [Card(suit, 8), Card(suit, 12), Card(suit, 2), Card(suit, 1), Card(suit, 3), Card(5, 5)]
    rule = game.verify_card_played(game.playerTurn.cards[0].rank, game.playerTurn.cards[0].suit) # play the 8
    assert rule == Rules.CHOOSE_SUIT

    rule = game.verify_card_played(game.playerTurn.cards[0].rank, game.playerTurn.cards[0].suit) # play the Queen
    assert rule == Rules.SKIP

    rule = game.verify_card_played(game.playerTurn.cards[0].rank, game.playerTurn.cards[0].suit) # play the 2
    assert rule == Rules.DRAW2

    rule = game.verify_card_played(game.playerTurn.cards[0].rank, game.playerTurn.cards[0].suit) # play the Ace
    assert rule == Rules.REVERSE

    rule = game.verify_card_played(game.playerTurn.cards[0].rank, game.playerTurn.cards[0].suit) # play the 3
    assert rule == Rules.VALID

    rule = game.verify_card_played(game.playerTurn.cards[0].rank, game.playerTurn.cards[0].suit) # play the invalid card
    assert rule == Rules.ERROR
    