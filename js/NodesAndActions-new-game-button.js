import { OxoBoardNodesActions} from './NodesAndActions-nine-oxo-games.js'
import {MetaGameNodesActions} from './NodesAndActions-metagame.js'

export const newGameButtonId="new-game-button"
const newGameButtonDomNode= ()=>document.getElementById(newGameButtonId)

export const assertDomNodesExist= function(){
  console.assert(newGameButtonDomNode(),'Expected newGameButtonDomNode with id ' + newGameButtonId)
}
export function NewGameButtonNodesActions(metaGameModel, metaGameNodesActions, oxoBoardsNodesActionsList) {

  this.node=newGameButtonDomNode()

  this.node.addEventListener('click', () => {

    metaGameModel.newGame()
    metaGameNodesActions.setAllCellAsUnplayed()

    for (let board of oxoBoardsNodesActionsList.filter(b => b)) {
      board.setAllCellAsUnplayed()
      for (let i = 1; i <= 9; i++) {
        oxoBoardsNodesActionsList[i] = new OxoBoardNodesActions(i, metaGameModel.games[i])
      }
    }
    for (let board of metaGameNodesActions.nodes.nineOxoBoards.querySelectorAll('.playable')) {
      board.classList.remove('playable')
    }
    metaGameNodesActions.nodes.game.classList.remove('game-over')
  })
}
