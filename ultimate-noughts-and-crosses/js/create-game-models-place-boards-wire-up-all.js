import ObservablePushQueue from './Observable-push-queue.js'
import UltimateOxoGame from './Ultimate-oxo-game.js'

import {nineBoardsDomNode, assertDomNode as nineBoardsAssertDomNodes} from './Nodes-nine-boards.js'
import {MetaGameNodesActions, assertDomNodes as metagameAssertDomNodes} from './NodesAndActions-metagame.js'
import {insertOxoBoardMarkup} from './Markup-oxo-board.js'
import {OxoBoardNodesActions, assertDomNodes as oxoBoardsAssertDomNodes} from './NodesAndActions-oxo-board.js'
import {NewGameButtonNodesActions, assertDomNodes as newGameButtonAssertDomNodes} from './NodesAndActions-new-game-button.js'
import {
  assertDomNodes as gameStewardAssertDomNodes,
  gameStewardNA,
  wireUpGameSteward
} from './NodesAndActions-game-steward.js'
import {registerComputerPlayerToObserveUiMoveQueue} from './computer-player.js'

export default function createGameModelsPlaceBoardsWireUpAll() {
  if(!window){
    throw new Error('Module create-and-wire-up-all expects window to be defined')
  }
  window.gameLog= new ObservablePushQueue()
  window.uiMoveQueue= new ObservablePushQueue()
  nineBoardsAssertDomNodes()
  metagameAssertDomNodes()
  oxoBoardsAssertDomNodes()
  newGameButtonAssertDomNodes()
  gameStewardAssertDomNodes()

  wireUpGameSteward()

  const metaGame=new UltimateOxoGame(window.gameLog)
  const metaGameNodesActions=new MetaGameNodesActions(metaGame)

  const oxoBoardNodesActionsList=[]
  oxoBoardNodesActionsList[1]= new OxoBoardNodesActions(1, metaGame.games[1], window.uiMoveQueue)
  for(let boardi=2; boardi<=9; boardi++){
    insertOxoBoardMarkup(boardi, nineBoardsDomNode())
    oxoBoardNodesActionsList[boardi]= new OxoBoardNodesActions(boardi, metaGame.games[boardi], window.uiMoveQueue)
  }

  const newGameButton=new NewGameButtonNodesActions(metaGame, metaGameNodesActions, oxoBoardNodesActionsList, window.uiMoveQueue)

  registerComputerPlayerToObserveUiMoveQueue(
    metaGame,
    gameStewardNA,
    oxoBoardNodesActionsList,
    window.uiMoveQueue)

  return {
    metaGame : metaGame,
    metaGameNodesActions : metaGameNodesActions,
    oxoBoardsNodesActionsList : oxoBoardNodesActionsList,
    newGameButtonNA : newGameButton
  }
}
