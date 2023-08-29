import {nineOxoBoardsDomNode, OxoBoardActions} from './NodesAndActions-nine-oxo-games.js'
import {gameDomNode} from './NodesAndActions-metagame.js'

export const newGameButtonId="new-game-button"
export const newGameButtonDomNode= ()=>document.getElementById(newGameButtonId)

export const assertDomNodesExist= function(){
  console.assert(newGameButtonDomNode(),'Expected newGameButtonDomNode with id ' + newGameButtonId)
}
export function wireUpNewGameButtonActions(metaGame, metaGameActions, oxoBoardsActions) {

  newGameButtonDomNode().addEventListener('click', () => {

    metaGame.newGame()
    metaGameActions.setAllCellAsUnplayed()

    for (let board of oxoBoardsActions.filter(b => b)) {
      board.setAllCellAsUnplayed()
      for (let i = 1; i <= 9; i++) {
        oxoBoardsActions[i] = new OxoBoardActions(i, metaGame.games[i])
      }
    }
    for (let board of nineOxoBoardsDomNode().querySelectorAll('.playable')) {
      board.classList.remove('playable')
    }
    gameDomNode().classList.remove('game-over')
  })
}
