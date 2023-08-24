import ObservablePushQueue from './observable-push-queue.js'
import {unplayedSquare} from './oxo-game.js'
import placeOxoBoardMarkup from './place-oxo-board.js'
import {wireUpOxoBoard, wireUpMetaGame, allMetagameCellSelector} from './wire-up-oxo-board.js'
import UltimateOxoGame from './ultimate-oxo-game.js'

export default function createGameModelsPlaceBoardsWireUpAll(container3by3="div[role=grid].three-by-three",
                                                             containerMetaGameGrid = "metagame-grid",
                                                             clearButtonId="new-game-button") {
  if(!window){
    throw new Error('Module create-and-wire-up-all expects window to be defined')
  }
  window.moveQueue= new ObservablePushQueue()

  const containerEl3by3 = document.querySelector(container3by3)
  const containerMetaGame = document.getElementById(containerMetaGameGrid)
  const metaGame=new UltimateOxoGame(window.moveQueue)
  const oxoBoards=[]
  const clearButton = document.getElementById(clearButtonId)
  wireUpMetaGame(metaGame, containerMetaGame)

  oxoBoards[1]= wireUpOxoBoard(1, metaGame.games[1], containerEl3by3)
  for(let i=2; i<=9; i++){
    placeOxoBoardMarkup(i, containerEl3by3)
    oxoBoards[i]= wireUpOxoBoard(i, metaGame.games[i], containerEl3by3)
  }

  clearButton.addEventListener('click', ()=>{
    for(let board of oxoBoards.filter(b=>b)){
      for(let cell of board.cells){
        cell.innerHTML= cell.innerHTML.replace(/[XO]/, unplayedSquare)
        cell.classList.remove('green','played')
      }
      metaGame.newGame()
      for(let i=1; i<=9; i++){
        oxoBoards[i]=wireUpOxoBoard(i, metaGame.games[i], containerEl3by3)
      }
    }
    for(let board of containerEl3by3.querySelectorAll('.playable')){
      board.classList.remove('playable')
    }
    const metaGameCells=containerMetaGame.querySelectorAll(allMetagameCellSelector)
    console.assert(metaGameCells.length===9, 'expected 9 metaGameCells, got', metaGameCells)
    for(let cell of metaGameCells){
      cell.innerHTML= cell.innerHTML.replace(/[XO]/, unplayedSquare)
    }
  })


  return {
    container3by3 : containerEl3by3,
    containerMetaGame : containerMetaGame,
    metaGame : metaGame,
    oxoBoards : oxoBoards,
    clearButton:clearButton
  }
}
