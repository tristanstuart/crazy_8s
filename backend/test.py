from logic.game import Game,Player,Rules


def test_numPlayers():
    game = Game({
        "name":"Emmanuel",
        "sid":"123"
        })
        
    game.addPlayer({
        "name":"Christian",
        "sid":"456"
        })
    game.addPlayer({
        "name":"Tristan",
        "sid":"789"
        })
    game.addPlayer({
        "name":"Marco",
        "sid":"101"
        })
     
    assert len(game.players) == 4
    assert game.players[2].getName() == "Tristan"