const unplayedSquare = '\u00A0'

const game= {
  boardModel : Array(9).fill(unplayedSquare),
  playerOnMove : 'X',
  winner : undefined,
  winLine : undefined,

  setWinnerIfWon() {
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
          const won=wins.map(line => {
              const player = game.boardModel[ line[0] ]
              if(player===unplayedSquare)return undefined
              //
              if(game.boardModel[ line[1] ]===player && game.boardModel[ line[2] ] === player){
                  return {line:line, player:player};
              }
              return undefined
          })
          const win = won.find(p => !!p );
          if(win){
              game.winner=win.player
              game.winLine=win.line;
              return true;
          }
          return false;
      },

  newGame(){
      game.playerOnMove='X'
      game.boardModel.fill(unplayedSquare)
      game.winner=undefined
      game.winLine=undefined
    }
}

function inputs() {

  const board1 = document
    .querySelectorAll(".nine-by-nine .oxo-board-section:nth-of-type(1) div[role=gridcell]")
  console.assert(board1.length == 9, 'Board 1 should have 9 cells')
  for (let i=0; i < board1.length; i++) {
    let cell= board1[i]
    cell.addEventListener('click', e => {
      const currentValue=game.boardModel[i]
      if(currentValue !== unplayedSquare) return; //ignore click already played square
      if(game.winner) return;
      //
      game.boardModel[i] = game.playerOnMove;
      e.target.innerHTML = e.target.innerHTML.replace('&nbsp;', game.playerOnMove)
      game.playerOnMove= (game.playerOnMove==='X' ? 'O' : 'X')
      if(game.setWinnerIfWon() ){
        for(let cell of game.winLine) { board1[cell].classList.add('green') }
      }
    })
  }
  function clearBoard1(){
    for(let cell of board1){
      cell.innerHTML = cell.innerHTML.replace(/X|O/, unplayedSquare)
      cell.classList.remove('green')
    }
  }
  const clearButton=document
    .querySelector(".nine-by-nine .oxo-board-section:nth-of-type(1) button[aria-label='Clear Board 1']")
  console.assert(clearButton !== undefined)
  clearButton.addEventListener('click',()=>{
        game.newGame();
        clearBoard1()
  })
  return {
    board1 : board1,
    newGame: ()=>{game.newGame(); clearBoard1()}
  }
}

function outputs(){
  return {

  }
}

export default function wireUp(){
  return { inputs :  inputs(), outputs: outputs() }
}
