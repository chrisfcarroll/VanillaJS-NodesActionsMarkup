import ObservablePushQueue from './observable-push-queue.js'
import placeOxoBoardMarkup from './place-oxo-board.js'
import UltimateOxoGame from './ultimate-oxo-game.js'
import {OxoBoardActions} from './NodesAndActions-nine-oxo-games.js'
import {MetaGameActions} from './NodesAndActions-metagame.js'
import {newGameButtonDomNode, wireUpNewGameButtonActions} from './NodesAndActions-new-game-button.js'


export default function createGameModelsPlaceBoardsWireUpAll() {
  if(!window){
    throw new Error('Module create-and-wire-up-all expects window to be defined')
  }
  window.moveQueue= new ObservablePushQueue()

  const metaGame=new UltimateOxoGame(window.moveQueue)
  const metaGameActions=new MetaGameActions(metaGame)

  const oxoBoardActions=[]
  oxoBoardActions[1]= new OxoBoardActions(1, metaGame.games[1])
  for(let boardi=2; boardi<=9; boardi++){
    placeOxoBoardMarkup(boardi)
    oxoBoardActions[boardi]= new OxoBoardActions(boardi, metaGame.games[boardi])
  }

  wireUpNewGameButtonActions(metaGame, metaGameActions, oxoBoardActions)

  return {
    metaGame : metaGame,
    metaGameActions : metaGameActions,
    oxoBoardActions : oxoBoardActions,
    newGameButton : newGameButtonDomNode()
  }
}
