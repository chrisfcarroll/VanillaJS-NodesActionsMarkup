import {unplayedSquare} from './oxo-game.js'

const nineOxoBoardsSelector="div[role=grid].three-by-three"
const boardSelectorPattern = ".oxo-board-section:nth-of-type(${gameNumber})"
const boardCellsByBoardNumberSelectorPattern=".oxo-board-section:nth-of-type(${boardNumber}) div[role=gridcell]"

const nineOxoBoardsDomNode = ()=>document.querySelector(nineOxoBoardsSelector)

function boardByNumberDomNode(boardNumber) {
  return nineOxoBoardsDomNode().querySelector(
    boardSelectorPattern.replace("${gameNumber}", boardNumber))
}

function cellsByBoardNumberDomNodes(boardNumber){
  console.assert(boardNumber>=1 && boardNumber<=9, 'Tried to select board number ' + boardNumber)
  return nineOxoBoardsDomNode().querySelectorAll(
    boardCellsByBoardNumberSelectorPattern.replace("${boardNumber}",boardNumber))
}

export function assertDomNodes() {
  console.assert(nineOxoBoardsDomNode(), 'nineOxoBoardsSelector ' + nineOxoBoardsSelector + ' isn\'t an HTML Node')
  console.assert(nineOxoBoardsDomNode(), 'nineOxoBoardsSelector ' + nineOxoBoardsSelector + ' isn\'t an HTML Node')
  for (let boardNumber = 1; boardNumber <= 9; boardNumber++) for (let i = 1; i <= 9; i++) {
    console.assert(cellsByBoardNumberDomNodes(i), 'Board ' + boardNumber + ' should have 9 cells')
  }
}

export function OxoBoardNodesActions(boardNumber, game) {
  //
  // off-by-1 errors: the games are played on boards 1-9 with squares 1-9
  // but arrays of DomNodes are 0-8
  //
  const thisCells= cellsByBoardNumberDomNodes(boardNumber)
  const that=this

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

  this.setAllCellAsUnplayed=function(){
    for (let cell of thisCells) {
      cell.innerHTML = cell.innerHTML.replace(/[XO]/, unplayedSquare)
      cell.classList.remove('green', 'played')
    }
  }

  for (let i=1; i<=9; i++) {
    const cell=thisCells[i-1]
    cleanCellIfUsedInAPreviousGame(cell)
    const thisCellOnClick= (e)=>cellOnClick(e,i)
    cell.addEventListener('click', thisCellOnClick)
    cell.eventForCell= thisCellOnClick
  }

  function cellOnClick(e,i) {
    const metaGame = game.metaGame
    const justPlayed = game.playMove(i)
    const wasValidMove = justPlayed !== unplayedSquare
    e.target.innerHTML = e.target.innerHTML.replace(/&nbsp;|X|O/, justPlayed)
    if (wasValidMove) {
      e.target.classList.add('played')
      for (let boardi = 1; boardi <= 9; boardi++) {
        const board = boardByNumberDomNode(boardi)
        if (!board) continue
          ;
        const showAsPlayable = metaGame && (!metaGame.games[boardi].winLine)
          && (metaGame.nextBoard === 0 || metaGame.nextBoard === boardi)
        if (showAsPlayable) {
          console.info('Board ' + boardi + ' is playable')
          board.classList.add('playable')
        } else {
          board.classList.remove('playable')
        }
      }
    }
    if (game.winLine) {
      for (let square of game.winLine) {
        thisCells[square - 1].classList.add('green')
      }
    }
  }
  function cleanCellIfUsedInAPreviousGame(cell) {
    if (cell.eventForCell) {
      cell.removeEventListener('click', cell.eventForCell)
      cell.classList.remove('green', 'played')
    }
  }
}
