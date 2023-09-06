import ObservablePushQueue from './Observable-push-queue.js'
import UltimateOxoGame from './Ultimate-oxo-game.js'

import {nineBoardsDomNode, assertDomNode as nineBoardsAssertDomNodes} from './Nodes-nine-boards.js'
import {MetaGameNodesActions, assertDomNodes as metagameAssertDomNodes} from './NodesAndActions-metagame.js'
import {insertOxoBoardHtml} from './Markup-oxo-board.js'
import {OxoBoardNodesActions, assertDomNodes as oxoBoardsAssertDomNodes} from './NodesAndActions-oxo-board.js'
import {NewGameButtonNodesActions, assertDomNodes as newGameButtonAssertDomNodes} from './NodesAndActions-new-game-button.js'


export default function createGameModelsPlaceBoardsWireUpAll() {
  if(!window){
    throw new Error('Module create-and-wire-up-all expects window to be defined')
  }
  window.moveQueue= new ObservablePushQueue()
  nineBoardsAssertDomNodes()
  metagameAssertDomNodes()
  oxoBoardsAssertDomNodes()
  newGameButtonAssertDomNodes()


  const metaGame=new UltimateOxoGame(window.moveQueue)
  const metaGameNodesActions=new MetaGameNodesActions(metaGame)

  const oxoBoardNodesActionsList=[]
  oxoBoardNodesActionsList[1]= new OxoBoardNodesActions(1, metaGame.games[1])
  for(let boardi=2; boardi<=9; boardi++){
    insertOxoBoardHtml(boardi, nineBoardsDomNode())
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
