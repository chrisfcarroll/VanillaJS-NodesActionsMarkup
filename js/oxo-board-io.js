import OxoGame, {unplayedSquare} from './oxo-game.js'


export function OxoBoardInputs(boardNumber, moveQueue, gameNamePrefix) {
    gameNamePrefix = (gameNamePrefix||"Game ").toString()
    const thisBoard =
      this.board = document.querySelectorAll(".nine-by-nine .oxo-board-section:nth-of-type("+boardNumber+") div[role=gridcell]")
    console.assert(this.board.length == 9, 'Board ' + boardNumber + ' should have 9 cells')

    const game= new OxoGame(moveQueue, gameNamePrefix + boardNumber);
    for (let i=0; i < this.board.length; i++) {
      let cell= this.board[i]
      cell.addEventListener('click', e => {
        e.target.innerHTML = e.target.innerHTML.replace(/&nbsp;|X|O/, game.playMove(i))
        if (game.winLine) {
          for (let cell of game.winLine) {
            this.board[cell].classList.add('green')
          }
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

export function wireUp(boardNumber, moveQueue,gameNamePrefix){

  const boards=[]

  function inputs(boardNumber) {

    if(!boards[boardNumber]){
      boards[boardNumber]= new OxoBoardInputs(boardNumber,moveQueue,gameNamePrefix)
    }
    return boards[boardNumber]
  }

  function outputs(boardNumber){
    return {

    }
  }

  return { inputs :  inputs(boardNumber), outputs: outputs(boardNumber) }
}
