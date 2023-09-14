import {OxoBoardNodesActions} from './NodesAndActions-oxo-board.js'
import {nineBoardsDomNode} from './Nodes-nine-boards.js'

const newGameButtonId="new-game-button"
const newGameButtonDomNode= ()=>document.getElementById(newGameButtonId)
export const NewGameAction="New Game"

export const assertDomNodes= function(){
  console.assert(newGameButtonDomNode(),'Expected newGameButtonDomNode with id ' + newGameButtonId)
}
export function NewGameButtonNodesActions(metaGameModel, metaGameNodesActions, oxoBoardsNodesActionsList, uiMoveQueue) {

  this.node=newGameButtonDomNode()
  this.uiMoveQueue= uiMoveQueue || []

  this.node.addEventListener('click', () => {

    metaGameModel.newGame()
    metaGameNodesActions.setAllCellAsUnplayed()

    for (let board of oxoBoardsNodesActionsList.filter(b => b)) {
      board.setAllCellAsUnplayed()
      for (let i = 1; i <= 9; i++) {
        oxoBoardsNodesActionsList[i] = new OxoBoardNodesActions(i, metaGameModel.games[i], uiMoveQueue)
      }
    }
    for (let board of nineBoardsDomNode().querySelectorAll('.playable')) {
      board.classList.remove('playable')
    }
    metaGameNodesActions.nodes.game.classList.remove('game-over')

    uiMoveQueue.push(NewGameAction)
  })
}
