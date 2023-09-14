import {unplayedSquare} from './Oxo-game.js'
import {nineBoardsDomNode} from './Nodes-nine-boards.js'

export const uiHints={
  green:'green',
  played:'played',
  computerPlayed:'computer-played',
  playable:'playable',
  gameOver:'game-over'
}
export const uiHintsList= Object.entries(uiHints).map(([_,hint])=> hint)

const boardSelectorPattern = ".oxo-board-section:nth-of-type(${gameNumber})"
const boardCellsByBoardNumberSelectorPattern=".oxo-board-section:nth-of-type(${boardNumber}) div[role=gridcell]"

function boardByNumberDomNode(boardNumber) {
  return nineBoardsDomNode().querySelector(
    boardSelectorPattern.replace("${gameNumber}", boardNumber))
}

function cellsByBoardNumberDomNodes(boardNumber){
  console.assert(boardNumber>=1 && boardNumber<=9, 'Tried to select board number ' + boardNumber)
  return nineBoardsDomNode().querySelectorAll(
    boardCellsByBoardNumberSelectorPattern.replace("${boardNumber}",boardNumber))
}

export function assertDomNodes() {
  for (let boardNumber = 1; boardNumber <= 9; boardNumber++) for (let i = 1; i <= 9; i++) {
    console.assert(cellsByBoardNumberDomNodes(i), 'Board ' + boardNumber + ' should have 9 cells')
  }
}

export function OxoBoardNodesActions(boardNumber, game, uiMoveQueue) {
  //
  // off-by-1 errors: the games are played on boards 1-9 with squares 1-9
  // but arrays of DomNodes are 0-8
  //
  const thisCells= cellsByBoardNumberDomNodes(boardNumber)
  const thisuiMoveQueue= uiMoveQueue || []

  this.nodes= {
    boardByNumber:boardByNumberDomNode,
    cells:thisCells
  }

  this.boardNumber=boardNumber;

  this.newGame = function(){
    for(let cell of thisCells){
      cell.innerHTML = cell.innerHTML.replace(/[XO]/, unplayedSquare)
      cell.classList.remove('green','played')
    }
    game.newGame()
  }

  this.clickSquare= function(square, uiHint){
    console.assert(1 <=square && square <= 9, `board${boardNumber}.clickSquare(${square}) is outside 1-9`)
    cellOnClick(cellsByBoardNumberDomNodes(boardNumber)[square-1], square, uiHint)
  }

  this.setAllCellAsUnplayed=function(){
    for (let cell of thisCells) {
      cell.innerHTML = cell.innerHTML.replace(/[XO]/, unplayedSquare)
      cell.classList.remove(...uiHintsList)
    }
  }

  for (let i=1; i<=9; i++) {
    const cell=thisCells[i-1]
    cleanCellIfUsedInAPreviousGame(cell)
    const thisCellOnClick= (e)=>cellOnClick(e.target,i)
    cell.addEventListener('click', thisCellOnClick)
    cell.eventForCell= thisCellOnClick
  }

  function cellOnClick(node,square, uiHint) {
    const justPlayed = game.playMove(square)
    const wasValidMove = !!justPlayed
    if (!wasValidMove) {return }
    //
    const metaGame = game.metaGame
    const isPlayable=(function(){
      const isPlayable=[]
      for (let boardi = 1; boardi <= 9 ; boardi++){
        isPlayable[boardi] = metaGame && (!metaGame.games[boardi].winLine)
              && (metaGame.nextBoard === 0 || metaGame.nextBoard === boardi)
      }
      return isPlayable
    })()

    const computerPlayed = uiHint && !!uiHint.match(uiHints.computerPlayed)
    const uiDelay1= computerPlayed ? 1500 : 0;
    const uiDelay2= computerPlayed ?  500 : 0;
    setTimeout(()=>{
      node.innerHTML = node.innerHTML.replace(/&nbsp;|X|O/, justPlayed)
      node.classList.add('played')
      if(uiHint){node.classList.add(uiHint)}
      setTimeout(()=>{
        for (let boardi = 1; boardi <= 9; boardi++) {
          const board = boardByNumberDomNode(boardi)
          if (!board) continue
            ;
          if (isPlayable[boardi]) {
            console.info('Board ' + boardi + ' is playable')
            board.classList.add('playable')
          } else {
            board.classList.remove('playable')
          }
        }
        if (game.winLine) {
          for (let square of game.winLine) {
            thisCells[square - 1].classList.add('green')
          }
        }
      },uiDelay2)
    }, uiDelay1)
    thisuiMoveQueue.push({game: game.name, player: justPlayed, playedAt: square})
  }

  function cleanCellIfUsedInAPreviousGame(cell) {
    if (!cell.eventForCell) { return }
    //
    cell.removeEventListener('click', cell.eventForCell)
    delete cell.eventForCell
    cell.classList.remove(...uiHintsList)
  }
}
