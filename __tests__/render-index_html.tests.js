import {screen} from '@testing-library/dom'
import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import {wireUpOxoBoard} from '../js/oxo-board-io'
import OxoGame from '../js/oxo-game'

let indexRaw;
let index;

async function getIndexHtml(){
  indexRaw= indexRaw || (await fs.readFile('index.html')).toString()
  index= index || new DOMParser().parseFromString(indexRaw,"text/html")
  return index
}

test('9tac game board renders', async ()=> {

  document.body.innerHTML= (await getIndexHtml()).body.innerHTML
  const board= screen.getByRole("grid", {name: "Board 1"})
  expect(board).toBeVisible()
})

test('9tac game board renders nine cells Top Left to Bottom Right', async ()=> {

  document.body.innerHTML= (await getIndexHtml()).body.innerHTML
  const expectedBoards=["Board 1"]

  // expect
  for(let boardName of expectedBoards){
    const board= screen.getByRole("grid", {name: boardName})
    const expectedLabels= document.querySelectorAll("[role='gridcell'] label",board)
    const topLeft = screen.getAllByRole("gridcell",
        {name:boardName + " top left"})
    expect(topLeft.length).toBe(1)

    for(let label of expectedLabels){
      const cell = screen.getByRole("gridcell",
          {name:`${boardName} ${label.innerHTML}`})
      expect(cell.innerHTML).toContain('&nbsp;')
    }
  }
})

test('Clicking on an empty game plays the first move', async()=>{
  const user = userEvent.setup()
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  const div9By9 = document.querySelector("div[role=grid].nine-by-nine")
  let {inputs} = wireUpOxoBoard(1, new OxoGame(),div9By9)
  //
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 top left'})
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('X')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')

  //cleanup
  inputs.newGame()
})

test('Clicking two squares on an empty game plays the first two moves', async()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  const div9By9 = document.querySelector("div[role=grid].nine-by-nine")
  let {inputs}= wireUpOxoBoard(1,new OxoGame([],"1"), div9By9)
  //
  let topMiddle = screen.getByRole("gridcell", {name:'Board 1 top middle'})
  await user.click(topMiddle)
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 top left'})
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('O')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')

  inputs.newGame()
})

test('Clicking a square a second time has no effect', async()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  const div9By9 = document.querySelector("div[role=grid].nine-by-nine")
  let {inputs,outputs} = wireUpOxoBoard(1,new OxoGame([],"1"), div9By9)
  //
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 top left'})
  await user.click(topLeft)
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('X')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')
  expect(topLeft.innerHTML).not.toContain('O')

  inputs.newGame()
})

test('Clicking a won game has no effect', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  const div9By9 = document.querySelector("div[role=grid].nine-by-nine")
  let {inputs,outputs} = wireUpOxoBoard(1, new OxoGame([],"1"), div9By9)

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=0; i<7; i++){
    await user.click(inputs.board[i])
  }
  //
  await user.click(inputs.board[0])
  expect(inputs.board[0].innerHTML).toContain('X')
  await user.click(inputs.board[7])
  expect(inputs.board[7].innerHTML).toContain('&nbsp;')

  //
  inputs.newGame()
})
