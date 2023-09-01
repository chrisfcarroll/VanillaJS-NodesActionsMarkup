import ObservablePushQueue from './observable-push-queue.js'
import insertOxoBoardHtml from './insert-oxo-board-html.js'
import UltimateOxoGame from './ultimate-oxo-game.js'
import {OxoBoardNodesActions} from './NodesAndActions-nine-oxo-games.js'
import {MetaGameNodesActions} from './NodesAndActions-metagame.js'
import {NewGameButtonNodesActions} from './NodesAndActions-new-game-button.js'


export default function createGameModelsPlaceBoardsWireUpAll() {
  if(!window){
    throw new Error('Module create-and-wire-up-all expects window to be defined')
  }
  window.moveQueue= new ObservablePushQueue()

  const metaGame=new UltimateOxoGame(window.moveQueue)
  const metaGameNodesActions=new MetaGameNodesActions(metaGame)

  const oxoBoardNodesActionsList=[]
  oxoBoardNodesActionsList[1]= new OxoBoardNodesActions(1, metaGame.games[1])
  for(let boardi=2; boardi<=9; boardi++){
    insertOxoBoardHtml(boardi, metaGameNodesActions.nodes.nineOxoBoards)
    oxoBoardNodesActionsList[boardi]= new OxoBoardNodesActions(boardi, metaGame.games[boardi])
  }

  const newGameButton=new NewGameButtonNodesActions(metaGame, metaGameNodesActions, oxoBoardNodesActionsList)

  return {
    metaGame : metaGame,
    metaGameNodesActions : metaGameNodesActions,
    oxoBoardsNodesActionsList : oxoBoardNodesActionsList,
    newGameButtonNA : newGameButton
  }
}
