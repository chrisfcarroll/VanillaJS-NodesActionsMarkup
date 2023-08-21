import OxoGame, {unplayedSquare} from './oxo-game.js'

function BoardInputs(boardNumber) {

    const thisBoard =
      this.board = document.querySelectorAll(".nine-by-nine .oxo-board-section:nth-of-type("+boardNumber+") div[role=gridcell]")
    console.assert(this.board.length == 9, 'Board ' + boardNumber + ' should have 9 cells')

    const game= new OxoGame();
    for (let i=0; i < this.board.length; i++) {
      let cell= this.board[i]
      cell.addEventListener('click', e => {
        const currentValue=game.boardModel[i]
        if(currentValue !== unplayedSquare) return; //ignore click already played square
        if(game.winner) return;
        //
        game.boardModel[i] = game.playerOnMove;
        e.target.innerHTML = e.target.innerHTML.replace('&nbsp;', game.playerOnMove)
        game.playerOnMove= (game.playerOnMove==='X' ? 'O' : 'X')
        if(game.setWinnerIfWon() ){
          for(let cell of game.winLine) { this.board[cell].classList.add('green') }
        }
      })
    }
    this.newGame = function(){
      for(let cell of thisBoard){
        cell.innerHTML = cell.innerHTML.replace(/X|O/, unplayedSquare)
        cell.classList.remove('green')
      }
      game.newGame()
    }
    const clearButton=document
      .querySelector(".nine-by-nine .oxo-board-section:nth-of-type("+boardNumber+") button[aria-label='Clear Board "+boardNumber+"']")
    console.assert(clearButton !== undefined)
    clearButton.addEventListener('click',this.newGame)
}

export default BoardInputs
