import OxoGame, {GameEvent, unplayedSquare} from './oxo-game.js'
import ObservablePushQueue from './observable-push-queue.js'
import {gameNumberFromName} from './ultimate-oxo-game.js'

export let boardCellSelectorPattern=".oxo-board-section:nth-of-type(${boardNumber}) div[role=gridcell]"
export let boardClearButtonSelectorPattern=".oxo-board-section:nth-of-type(${boardNumber}) button[aria-label='Clear Board ${boardNumber}']"

export let metagameCellSelectorPattern="div[role=gridcell]:nth-of-type(${gameNumber})"
export function OxoBoardInputs(boardNumber, game, containerElement) {
    const thisBoard =
      this.board = containerElement.querySelectorAll(boardCellSelectorPattern.replace("${boardNumber}",boardNumber))
    console.assert(this.board.length == 9, 'Board ' + boardNumber + ' should have 9 cells')

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
    const clearButton=containerElement
      .querySelector(boardClearButtonSelectorPattern.replaceAll("${boardNumber}",boardNumber))
    console.assert(clearButton !== undefined)
    clearButton.addEventListener('click',this.newGame)
}

export function wireUpOxoBoard(boardNumber, game, container){

  const boards=[]

  function inputs(boardNumber) {

    if(!boards[boardNumber]){
      boards[boardNumber]= new OxoBoardInputs(boardNumber,game,container)
    }
    return boards[boardNumber]
  }

  function outputs(boardNumber){
    return {}
  }

  return { inputs :  inputs(boardNumber), outputs: outputs(boardNumber) }
}

export function wireUpMetaGame(metaGame,boardGridElement){
  let queue= metaGame.metaGame.moveQueue= new ObservablePushQueue()
  queue.addObserver("metaGameOutput", e=>{
    console.log("metagame output got ",e)
    let action= new GameEvent(e.value.game, e.value.player,e.value.playedAt)
    let player=e.value.player
    let cell= boardGridElement.querySelector(metagameCellSelectorPattern.replaceAll("${gameNumber}",e.value.playedAt))
    cell.innerHTML= cell.innerHTML.replace(/&nbsp;|X|O/, player)
  })
}
