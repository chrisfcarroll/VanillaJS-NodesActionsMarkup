import {screen} from '@testing-library/dom'
import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import OxoGame from '../js/oxo-game'
import {cellsByBoardNumberDomNodes, OxoBoardActions} from '../js/NodesAndActions-nine-oxo-games'

let indexRaw;
let index;

async function getIndexHtml(){
  indexRaw= indexRaw || (await fs.readFile('index.html')).toString()
  index= index || new DOMParser().parseFromString(indexRaw,"text/html")
  return index
}
test('Clicking on an empty game plays the first move', async()=>{
  const user = userEvent.setup()
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  let board = new OxoBoardActions(1, new OxoGame())
  //
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 top left'})
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('X')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')

  //cleanup
  board.newGame()
})

test('Clicking two squares on an empty game plays the first two moves', async()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  let board= new OxoBoardActions(1, new OxoGame([], "1"))
  //
  let topMiddle = screen.getByRole("gridcell", {name:'Board 1 top middle'})
  await user.click(topMiddle)
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 top left'})
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('O')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')

  board.newGame()
})

test('Clicking a square a second time has no effect', async()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  let board = new OxoBoardActions(1, new OxoGame([], "1"))
  //
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 top left'})
  await user.click(topLeft)
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('X')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')
  expect(topLeft.innerHTML).not.toContain('O')

  board.newGame()
})

test('Clicking a won game has no effect', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  let board = new OxoBoardActions(1, new OxoGame([], "1"))

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=1; i<=7; i++){
    await user.click(cellsByBoardNumberDomNodes(board.boardNumber)[i])
  }
  //
  await user.click(board.queryCell(1))
  expect(board.queryCell(1).innerHTML).toContain('X')
  await user.click(board.queryCell(8))
  expect(board.queryCell(8).innerHTML).toContain('&nbsp;')

  //
  board.newGame()
})
