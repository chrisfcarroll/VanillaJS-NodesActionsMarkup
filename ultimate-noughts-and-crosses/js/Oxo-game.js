import {gameNumberFromName} from './Ultimate-oxo-game.js'

export const unplayedSquare = '\u00A0'

export class GameEvent{
  constructor(game,player,playedAt) {
    this.game=game
    this.player = player
    this.playedAt = playedAt
  }
}

function OxoGame(moveQueue, name, metaGame=undefined) {
    this.moveQueue= moveQueue || []
    this.name=name || 'Started at ' + new Date().toTimeString()
    this.boardModel= Array(10).fill(unplayedSquare)
    this.playerOnMove = 'X'
    this.winner = undefined
    this.winLine = undefined
    this.metaGame=metaGame
    this.metaGameNumber= metaGame? gameNumberFromName(name) : 0
    const that=this

    this.playMove = function(playedAt) {
      if(playedAt<1 || playedAt>9)console.error('playedAt',playedAt,'in game ' + that.name)
      const currentValue = that.boardModel[playedAt]
      function moveIsIllegal() {
        //ignore click already played square
        if (currentValue !== unplayedSquare) return currentValue;
        //ignore moves on a won board
        if (that.winner) return currentValue;
        //ignore move that is the wrong board in the metaGame
        if (that.metaGame && that.metaGame.nextBoard && that.metaGame.nextBoard !== that.metaGameNumber) return currentValue
      }
      if(moveIsIllegal()){return false}
      //
      that.boardModel[playedAt] = that.playerOnMove;
      const played= that.playerOnMove
      that.setWinnerIfWon()
      that.playerOnMove = (that.playerOnMove === 'X' ? 'O' : 'X')
      that.moveQueue.push( {game:that.name, player:played, playedAt:playedAt} )
      return played
    }


    this.setWinnerIfWon= function() {
      const wins = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ]
      const won = wins.map(line => {
        const player = this.boardModel[line[0]]
        if (player === unplayedSquare) return undefined
        //
        if (this.boardModel[line[1]] === player && this.boardModel[line[2]] === player) {
          return {line: line, player: player};
        }
        return undefined
      })
      const win = won.find(p => !!p);
      if (win) {
        this.winner = win.player
        this.winLine = win.line;
        return true;
      }
      return false;
    }

    this.newGame = function() {
      this.playerOnMove = 'X'
      this.boardModel.fill(unplayedSquare)
      this.winner = undefined
      this.winLine = undefined
    }
}

export default OxoGame
