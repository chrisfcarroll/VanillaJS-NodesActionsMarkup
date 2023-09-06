# Ultimate Noughts and Crosses 🚀

A small game example of vanillaJS using [Nodes-Actions-Markup](../), including commandline unit tests.

- HTML5
- CSS
- VanillaJS/ES6 with modules supported in the browser
- https://testing-library.com & https://jestjs.io

This game should be running at https://www.cafe-encounter.net/small-games

### How to play

This is currently 2-player only. You are playing nine simultaneous games of noughts and 
crosses with the rule that the square you play in on one board dictates which board
your opponent must make his next move on. If you are supposed to play on an already
finished board, then you may instead play on any unfinished board.


### Game components

| File in ./js/ directory | Responsibility                         |
|-------------------------|----------------------------------------|
| Oxo-game.js             | A model for a noughts and crosses game
| Ultimate-oxo-game.js    | A model for a 9-board noughts & crosses metagame |
| | |
| Nodes-nine-boards.js    | Html node references for the 9 game boards |
| NodesAndActions-metagame.js | Nodes and Actions for the metagame |
| NodesAndActions-oxo-board.js | Nodes and Actions for a single game board |
| NodesAndActions-new-game-button.js | Nodes and Actions for the New Game button |
| Markup-oxo-board.js     | Markup for a single game board |
| | |
| Observable-push-queue.js | An observable queue to link games to metagame
| | |
| create-game-models-place-boards-wire-up-all.js | Bootstrap everything |





