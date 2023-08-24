import {screen} from '@testing-library/dom'
import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import {wireUpOxoBoard} from '../js/wire-up-oxo-board'
import OxoGame from '../js/oxo-game'

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
  const div3by3 = document.querySelector("div[role=grid].three-by-three")
  let board = wireUpOxoBoard(1, new OxoGame(),div3by3)
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
  const div3by3 = document.querySelector("div[role=grid].three-by-three")
  let board= wireUpOxoBoard(1,new OxoGame([],"1"), div3by3)
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
  const div3by3 = document.querySelector("div[role=grid].three-by-three")
  let board = wireUpOxoBoard(1,new OxoGame([],"1"), div3by3)
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
  const div3by3 = document.querySelector("div[role=grid].three-by-three")
  let board = wireUpOxoBoard(1, new OxoGame([],"1"), div3by3)

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=1; i<=7; i++){
    await user.click(board.cells[i])
  }
  //
  await user.click(board.cells[1])
  expect(board.cells[1].innerHTML).toContain('X')
  await user.click(board.cells[8])
  expect(board.cells[8].innerHTML).toContain('&nbsp;')

  //
  board.newGame()
})
