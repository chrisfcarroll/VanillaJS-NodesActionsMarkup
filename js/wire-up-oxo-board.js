import {unplayedSquare} from './oxo-game.js'
import ObservablePushQueue from './observable-push-queue.js'


export let allBoardCellsSelector=".oxo-board-section div[role=gridcell]"

export let allMetagameCellSelector="div[role=gridcell]"

export let boardCellSelectorPattern=".oxo-board-section:nth-of-type(${boardNumber}) div[role=gridcell]"
export let boardSelectorPattern = ".oxo-board-section:nth-of-type(${gameNumber})"
export let allBoardsSelector = ".oxo-board-section"

export let metagameCellSelectorPattern="div[role=gridcell]:nth-of-type(${gameNumber})"
export function OxoBoardInputs(boardNumber, game, containerElement) {
    //
    // off-by-1 errors: the games are played on boards 1-9 with squares 1-9.
    // The array of html elements is 0-8
    //
    const thisCells =
      this.cells = containerElement.querySelectorAll(boardCellSelectorPattern.replace("${boardNumber}",boardNumber))
    console.assert(this.cells.length === 9, 'Board ' + boardNumber + ' should have 9 cells')

    for (let i=1; i <= this.cells.length; i++) {
      let cell= thisCells[i-1]
      if(cell.eventForCell){
        cell.removeEventListener('click', cell.eventForCell)
        cell.classList.remove('green','played')
      }
      const eventForCell=function(e){
        const metaGame=game.metaGame
        const justPlayed = game.playMove(i)
        const wasValidMove= justPlayed!==unplayedSquare
        e.target.innerHTML = e.target.innerHTML.replace(/&nbsp;|X|O/, justPlayed)
        if(wasValidMove){
          e.target.classList.add('played')
          for(let boardi=1; boardi <= 9 ; boardi++){
            const board=containerElement.querySelector(boardSelectorPattern.replace("${gameNumber}",boardi))
            if(!board)continue
            ;
            const showAsPlayable= metaGame && (!metaGame.games[boardi].winLine)
                && (metaGame.nextBoard===0 || metaGame.nextBoard===boardi)
            if(showAsPlayable){
              console.info('Board '+ boardi +' is playable')
              board.classList.add('playable')
            }else{
              board.classList.remove('playable')
            }
          }
        }
        if (game.winLine) {
          for (let square of game.winLine) {
            thisCells[square-1].classList.add('green')
          }
        }
      }

      cell.addEventListener('click', eventForCell)
      cell.eventForCell= eventForCell
    }
    this.newGame = function(){
      for(let cell of thisCells){
        cell.innerHTML = cell.innerHTML.replace(/[XO]/, unplayedSquare)
        cell.classList.remove('green','played')
      }
      game.newGame()
    }
}

export function wireUpOxoBoard(boardNumber, game, container){
  return new OxoBoardInputs(boardNumber,game,container)
}

export function wireUpMetaGame(metaGame,boardsContainer){
  let queue= metaGame.metaGame.moveQueue= new ObservablePushQueue()

  queue.addObserver("metaGameOutput", e=>{
    console.log("Metagame played",e)
    // GameEvent(e.action.game, e.action.player,e.action.playedAt)
    let player=e.action.player
    let cell= boardsContainer.querySelector(metagameCellSelectorPattern.replaceAll("${gameNumber}",e.action.playedAt))
    cell.innerHTML= cell.innerHTML.replace(/&nbsp;|X|O/, player)
    if(metaGame.metaGame.winLine){
      for(let square of metaGame.metaGame.winLine){
        let cell= boardsContainer.querySelector(metagameCellSelectorPattern.replaceAll("${gameNumber}",square))
        cell.classList.add("green")
      }
      for(let board of boardsContainer.querySelector(allBoardsSelector)){
        board.classList.remove('playable')
      }
    }
  })
}
