import ObservablePushQueue from './observable-push-queue.js'
import OxoGame from './oxo-game.js'
import placeOxoBoardMarkup from './place-oxo-board.js'
import {wireUpOxoBoard,wireUpMetaGame} from './oxo-board-wire-up.js'
import UltimateOxoGame, {clearAllGames} from './ultimate-oxo-game.js'

export default function createBoardsAndWireUpAll(container9x9="div[role=grid].nine-by-nine",
                                                 containerMetaGame = "metagame-grid",
                                                 clearButtonId="new-game-button") {
  if(!window){
    throw new Error('Module create-and-wire-up-all expects window to be defined')
  }
  window.moveQueue= new ObservablePushQueue()
  window.oldGames=[]
  const gameNamePrefix="Game"
  const container9By9 = document.querySelector(container9x9)
  const oxoBoards=[]
  oxoBoards[1]= wireUpOxoBoard(1, new OxoGame(window.moveQueue, gameNamePrefix + 1), container9By9)
  for(let i=2; i<=9; i++){
    placeOxoBoardMarkup(i, container9By9)
    oxoBoards[i]= wireUpOxoBoard(i,new OxoGame(window.moveQueue, gameNamePrefix + i),container9By9)
  }

  let metaGame=new UltimateOxoGame(
                  window.moveQueue,
                  Array(9).fill('').map((e,i)=>gameNamePrefix+(i+1)))
  wireUpMetaGame(metaGame, document.getElementById(containerMetaGame))

  const clearButton = document.getElementById(clearButtonId)
  clearButton.addEventListener('click', ()=>{
      debugger
      clearAllGames(oxoBoards ,metaGame.metaGame,window.moveQueue,window.oldGames)
    })

  return {
    container9By9 : container9By9,
    containerMetaGame : document.getElementById(containerMetaGame),
    metaGame : metaGame,
    oxoBoards : oxoBoards,
    clearButton:clearButton
  }
}
