from .cards import Card

class Deck():
    def __init__(self) -> None:
        self.deck = []

    def init_cards(self):
        for suit_id in range(1, 5):
            for rank_id in range(1, 14):
                new_card = Card(suit_id, rank_id)
                self.deck.append(new_card)
        return self.deck