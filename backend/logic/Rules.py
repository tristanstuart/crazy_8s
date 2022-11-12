from enum import Enum

class Rules(Enum):
    ERROR = -1,
    VALID = 0,
    WINNER = 1,
    CHOOSE_SUIT = 2,
    SKIP = 3,
    DRAW2 = 4,
    REVERSE = 5