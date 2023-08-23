import ObservablePushQueue from './observable-push-queue.js'
import {unplayedSquare} from './oxo-game.js'
import placeOxoBoardMarkup from './place-oxo-board.js'
import {wireUpOxoBoard, wireUpMetaGame, allMetagameCellSelector} from './oxo-board-wire-up.js'
import UltimateOxoGame from './ultimate-oxo-game.js'

export default function createMetaGameAndPlaceBoardsAndWireUpAll(container9x9="div[role=grid].nine-by-nine",
                                                                 containerMetaGameGrid = "metagame-grid",
                                                                 clearButtonId="new-game-button") {
  if(!window){
    throw new Error('Module create-and-wire-up-all expects window to be defined')
  }
  window.moveQueue= new ObservablePushQueue()

  const container9By9 = document.querySelector(container9x9)
  const containerMetaGame = document.getElementById(containerMetaGameGrid)
  const metaGame=new UltimateOxoGame(window.moveQueue)
  const oxoBoards=[]
  const clearButton = document.getElementById(clearButtonId)
  wireUpMetaGame(metaGame, containerMetaGame)

  oxoBoards[1]= wireUpOxoBoard(1, metaGame.games[1], container9By9)
  for(let i=2; i<=9; i++){
    placeOxoBoardMarkup(i, container9By9)
    oxoBoards[i]= wireUpOxoBoard(i, metaGame.games[i], container9By9)
  }

  clearButton.addEventListener('click', ()=>{
    for(let board of oxoBoards.filter(b=>b)){
      for(let cell of board.cells){
        cell.innerHTML= cell.innerHTML.replace(/[XO]/, unplayedSquare)
        cell.classList.remove('green')
      }
      metaGame.newGame()
      for(let i=1; i<=9; i++){
        oxoBoards[i]=wireUpOxoBoard(i, metaGame.games[i], container9By9)
      }
    }
    const metaGameCells=containerMetaGame.querySelectorAll(allMetagameCellSelector)
    console.assert(metaGameCells.length===9, 'expected 9 metaGameCells, got', metaGameCells)
    for(let cell of metaGameCells){
      cell.innerHTML= cell.innerHTML.replace(/[XO]/, unplayedSquare)
    }
  })


  return {
    container9By9 : container9By9,
    containerMetaGame : containerMetaGame,
    metaGame : metaGame,
    oxoBoards : oxoBoards,
    clearButton:clearButton
  }
}
