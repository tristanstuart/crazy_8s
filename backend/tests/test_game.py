import pytest
from backend.logic.game import Game
from backend.logic.Rules import Rules


class Test_Class:
    game = Game('testAdmin')
    game.gameStart()
    value = 0

    def test_game_init(self):
        assert self.game.getAdmin() == 'testAdmin'
        assert self.game.num_players == 1
        assert self.game.activeSuit != ''

    def test_addPlayer(self):
        playerInfo = {'name': 'testPlayer', 'sid': '13245'}
        self.game.addPlayer(playerInfo)
        assert self.game.num_players == 2
        assert self.game.num_players != 3

    def test_upcard(self):
        assert self.game.upcard() != ''

    def test_getPlayerTurn(self):
        assert self.game.getPlayerTurn != None

    def test_endGame(self):
        self.game.playerTurn.cards = []
        assert self.game.endGame() == True
        self.game.playerTurn.cards = [1,2]
        assert self.game.endGame() == False