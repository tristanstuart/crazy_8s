from .cards import Card
class Player():
    def __init__(self, info) -> None:
        print("info",info)
        self.info = info
        self.cards = []


    def player_turn(self,up_card,deck,pile,activeSuit):
        valid_play = False
        is_eight = False
        print( "\nYour hand: ")
        for card in self.cards:
            print("   " + card.short_name)

        print("What do you want to do?")
        response = input("Type a card to play or 'Draw' to take a card: ")
        while not valid_play:
            selected_card = None
            while selected_card == None:
                if response.lower() == "draw":
                    valid_play = True
                    if len(deck) > 0:
                        self.cards.append(deck.pop())
                        
                        print("You drew: " + str(self.cards[len(self.cards)-1])) 
                    else:
                        print("There are no cards left in the deck.")
                    return
                else:
                    for card in self.cards:
                        if response.upper() == card.short_name:
                            selected_card = card
                    if selected_card == None:
                        response = input("You don't have that card. Try again: ")

            if selected_card.rank == '8':
        
                for i in range(len(self.cards)):
                    if self.cards[i] == selected_card:
                        pile.insert(0,self.cards.pop(i));
                        break;

                activeSuit = self.get_new_suit()
                pile[0].suit = activeSuit
                print(activeSuit  + " suit in player turn")
                return;
            elif selected_card.suit == activeSuit:
                valid_play = True
            elif selected_card.rank == up_card.rank:
                valid_play = True

            if valid_play:
                #
                for i in range(len(self.cards)):
                    if self.cards[i] == selected_card:
                        pile.insert(0,self.cards.pop(i));
                        break;
                
                print("You played " + pile[0].long_name)
            if not valid_play:
                response = input("That's not a legal play. Try again: ")
        

    def get_new_suit(self):
        activeSuit = ""
        got_suit = False
        while not got_suit:
            suit = input("Pick a suit: ")
            if suit.lower() == 'd':
                activeSuit = "Diamonds"
                got_suit = True
            elif suit.lower() == 'h':
                activeSuit = "Hearts"
                got_suit = True
            elif suit.lower() == 's':
                activeSuit = "Spades"
                got_suit = True
            elif suit.lower() == 'c':
                activeSuit = "Clubs"
                got_suit = True
            else:
                print ("Not a valid suit. Try again.")
        print ("You picked "+ activeSuit)
        return activeSuit

    def __repr__(self):
        return self.getName() + " (" + self.getSID() + ")"

    def getName(self):
        return self.info['name']

    def getSID(self):
        return self.info['sid']

    def getCards(self):
        cards = {"hand":[]}
        for card in self.cards:
            cards["hand"].append({
                "rank":card.rank,
                "suit":card.suit
            })
        return cards