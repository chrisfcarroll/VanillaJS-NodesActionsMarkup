import ObservablePushQueue from './Observable-push-queue.js'
import {unplayedSquare} from './Oxo-game.js'
import {uiHintsList} from './NodesAndActions-oxo-board.js'

const gameHTMLElementId="game"
const metaGameHTMLElementId = "metagame-grid"
const metagameAllCellsSelector="div[role=gridcell]"
const metagameCellByNumberSelector="div[role=gridcell]:nth-of-type(${gameNumber})"

const gameDomNode= ()=>document.getElementById(gameHTMLElementId)
const metaGameDomNode = () => document.getElementById(metaGameHTMLElementId)
const metaGameAllCellDomNodes =
          () => metaGameDomNode().querySelectorAll(metagameAllCellsSelector)
const metaGameCellByNumberDomNode = function(i) {
      console.assert(i>=1 && i<=9, 'attempt to access metaGame Cell ' + i)
      return metaGameDomNode().querySelector(metagameCellByNumberSelector.replace("${gameNumber}", i))
    }

export const assertDomNodes = function(){
  console.assert(gameDomNode(),`expected ${gameHTMLElementId} ID for one node`)
  console.assert(metaGameDomNode(), 'expected ' + metaGameHTMLElementId + ' ID for one node')
  console.assert(metaGameAllCellDomNodes().length === 9, 'expected 9 metaGame grid cells, got', metaGameAllCellDomNodes())
  console.assert(metaGameCellByNumberDomNode(1), `expected 1 metaGame grid cell for ${metagameCellByNumberSelector} with gameNumber=1`)
}

export function MetaGameNodesActions(metaGame){

  this.nodes = {
    game:gameDomNode(),
    metaGame:metaGameDomNode(),
    metaGameAllCells: metaGameAllCellDomNodes(),
    metaGameCellByNumber:metaGameCellByNumberDomNode
  }

  this.setAllCellAsUnplayed = function(){
    for (let cell of metaGameAllCellDomNodes()) {
      cell.innerHTML = cell.innerHTML.replace(/[XO]/, unplayedSquare)
      cell.classList.remove(...uiHintsList)
    }
  }

  let queue= metaGame.metaGame.moveQueue= new ObservablePushQueue()

  queue.addObserver("metaGameOutput", e=>{

    console.log("Metagame played",e)
    // GameEvent(e.action.game, e.action.player,e.action.playedAt)
    let player=e.action.player
    let cell= metaGameCellByNumberDomNode(e.action.playedAt)
    cell.innerHTML= cell.innerHTML.replace(/&nbsp;|X|O/, player)
    if(metaGame.metaGame.winLine){
      for(let square of metaGame.metaGame.winLine){
        let cell= metaGameCellByNumberDomNode(square)
        cell.classList.add("green")
      }
      gameDomNode().classList.add('game-over')
    }
  })
}
