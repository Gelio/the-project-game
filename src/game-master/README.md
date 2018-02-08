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

TODO: add stats and their description

## Logs

Contains all the messages from the Game Master, each with a corresponding
_log level_ and _timestamp_.
