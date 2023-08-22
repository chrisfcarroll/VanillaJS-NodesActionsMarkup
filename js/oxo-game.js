export const unplayedSquare = '\u00A0'

function OxoGame(moveQueue, name) {
    let _moveQueue= moveQueue || []
    this.name=name || 'Started at ' + new Date().toTimeString()
    this.boardModel= Array(9).fill(unplayedSquare)
    this.playerOnMove = 'X'
    this.winner = undefined
    this.winLine = undefined

    this.playMove = function(playedAt) {
      const currentValue = this.boardModel[playedAt]
      if (currentValue !== unplayedSquare) return currentValue; //ignore click already played square
      if (this.winner) return currentValue;
      //
      this.boardModel[playedAt] = this.playerOnMove;
      const played= this.playerOnMove
      _moveQueue.push({game:this.name, player:this.playerOnMove, playedAt:playedAt})
      this.playerOnMove = (this.playerOnMove === 'X' ? 'O' : 'X')
      this.setWinnerIfWon()
      return played
    }


    this.setWinnerIfWon= function() {
      const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [1, 4, 7],
        [2, 5, 8],
        [0, 3, 6],
        [0, 4, 8],
        [2, 4, 6]
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
    },

    this.newGame = function() {
      this.playerOnMove = 'X'
      this.boardModel.fill(unplayedSquare)
      this.winner = undefined
      this.winLine = undefined
    }
}

export default OxoGame
