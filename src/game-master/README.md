# Game Master

Game Master is responsible for accepting/rejecting players and handling the game logic.

The UI is divided into 3 sections.

## Board

The main section is the board. Each team's area is colored in blue/red, according to team colors.

The board legend:

* `P` - player (with blue/red foreground)
* `X` - piece:
  * grey - sham
  * yellow - normal piece
* `G` - goal:
  * yellow - completed
  * white - uncompleted

`ui/BoardFormatter` is a class responsible for displaying each tile on the board.

## Stats

The box in the top-right contains game stats, including:

* the current round number
* total number of rounds to be played
* team scores
* the number of players in each team
* teams capacities
* the number of pieces (total, shams, picked up) on the board

## Logs

Contains all the messages from the Game Master, each with a corresponding
_log level_ and _timestamp_.
