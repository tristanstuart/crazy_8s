from logic.game import Game,Player,Rules
import random

def test_playerName():
    assert Player({"name":"julio","sid":"1001"}).getName() == "julio"

def test_playerSID():
    assert Player({"name":"marco","sid":"1651"}).getSID() == "1651"
    
def test_cards():
    game = Game({
        "name":"marco",
        "sid":"1001"
        })
    game.addPlayer({
        "name":"nile",
        "sid":"456"
        })
    game.gameStart()

    assert len(game.players[0].cards) != 0
    assert len(game.players[1].cards) != 0
    
    assert game.players[0].cards != None
    assert game.players[1].cards != None
    
    assert game.players[0].cards != game.players[1].cards

def test_deal():
    game = Game({
        "name":"bobby",
        "sid":"1001"
        })
    game.addPlayer({
        "name":"bob",
        "sid":"456"
        })
    game.gameStart()
    
    cards = game.getPlayerTurn().cards
    upCard = game.upcard()
    options = []
    
    for card in cards:
        if card.rank == upCard.rank:
            options.append(card)
            continue
        elif card.suit == upCard.suit or card.suit == game.activeSuit:
            options.append(card)
    
    if len(options) > 0:
        chosenCard = random.choice(options)
        result,message = game.play_card({"card":{"rank":chosenCard.rank,"suit":chosenCard.suit}})
        if chosenCard.rank == "8":
            assert result == Rules.CHOOSE_SUIT
        elif chosenCard.rank == "2":
            assert result == None
        elif chosenCard.rank == "Ace":
            assert result == None
        elif chosenCard.rank == "Queen":
            assert result == Rules.SKIP

        return
        
    assert len(options) == 0
    

def test_numPlayers():
    game = Game({
        "name":"marco",
        "sid":"1001"
        })
        
    game.addPlayer({
        "name":"nile",
        "sid":"456"
        })
    
    assert game.players[0] != game.players[1] 
    assert len(game.players) != 0

