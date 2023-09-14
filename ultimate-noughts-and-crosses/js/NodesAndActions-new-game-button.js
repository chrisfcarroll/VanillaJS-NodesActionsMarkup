import {OxoBoardNodesActions, uiHintsList} from './NodesAndActions-oxo-board.js'
import {nineBoardsDomNode} from './Nodes-nine-boards.js'
import {gameStewardNA} from './NodesAndActions-game-steward.js'

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
    metaGameNodesActions.nodes.game.classList.remove(...uiHintsList)

    for (let board of oxoBoardsNodesActionsList.filter(b => b)) {
      board.setAllCellAsUnplayed()
      for (let i = 1; i <= 9; i++) {
        oxoBoardsNodesActionsList[i] = new OxoBoardNodesActions(i, metaGameModel.games[i], uiMoveQueue)
      }
    }
    for (let board of nineBoardsDomNode().querySelectorAll('.playable')) {
      board.classList.remove(...uiHintsList)
    }

    gameStewardNA.nodes.getGroupIsPlayedBy('X').classList.add("your-turn")
    gameStewardNA.nodes.getGroupIsPlayedBy('O').classList.remove("your-turn")

    uiMoveQueue.push(NewGameAction)
  })
}
