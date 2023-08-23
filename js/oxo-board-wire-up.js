import {unplayedSquare} from './oxo-game.js'
import ObservablePushQueue from './observable-push-queue.js'

export let boardCellSelectorPattern=".oxo-board-section:nth-of-type(${boardNumber}) div[role=gridcell]"
export let boardClearButtonSelectorPattern=".oxo-board-section:nth-of-type(${boardNumber}) button[aria-label='Clear Board ${boardNumber}']"

export let metagameCellSelectorPattern="div[role=gridcell]:nth-of-type(${gameNumber})"
export function OxoBoardInputs(boardNumber, game, containerElement) {
    // off-by-1 errors: the games are played on boards 1-9 with squares 1-9.
    // The array of html elements is 0-8

    const thisCells =
      this.cells = containerElement.querySelectorAll(boardCellSelectorPattern.replace("${boardNumber}",boardNumber))
    console.assert(this.cells.length === 9, 'Board ' + boardNumber + ' should have 9 cells')

    for (let i=1; i <= this.cells.length; i++) {
      let cell= this.cells[i-1]
      cell.addEventListener('click', e => {
        e.target.innerHTML = e.target.innerHTML.replace(/&nbsp;|X|O/, game.playMove(i))
        if (game.winLine) {
          for (let cell of game.winLine) {
            this.cells[cell-1].classList.add('green')
          }
        }
      })
    }
    this.newGame = function(){
      for(let cell of thisCells){
        cell.innerHTML = cell.innerHTML.replace(/[XO]/, unplayedSquare)
        cell.classList.remove('green')
      }
      game.newGame()
    }
    const maybeClearButton=containerElement
      .querySelectorAll(boardClearButtonSelectorPattern.replaceAll("${boardNumber}",boardNumber))
    if(maybeClearButton.length) {
      maybeClearButton[0].addEventListener('click', this.newGame)
    }
}

export function wireUpOxoBoard(boardNumber, game, container){
  return new OxoBoardInputs(boardNumber,game,container)
}

export function wireUpMetaGame(metaGame,boardGridElement){
  let queue= metaGame.metaGame.moveQueue= new ObservablePushQueue()
  queue.addObserver("metaGameOutput", e=>{
    console.log("metagame output got ",e)
    // GameEvent(e.value.game, e.value.player,e.value.playedAt)
    let player=e.value.player
    let cell= boardGridElement.querySelector(metagameCellSelectorPattern.replaceAll("${gameNumber}",e.value.playedAt))
    cell.innerHTML= cell.innerHTML.replace(/&nbsp;|X|O/, player)
    if(metaGame.metaGame.winLine){
      for(let square of metaGame.metaGame.winLine){
        let cell= boardGridElement.querySelector(metagameCellSelectorPattern.replaceAll("${gameNumber}",square))
        cell.classList.add("green")
      }
    }
  })
}
