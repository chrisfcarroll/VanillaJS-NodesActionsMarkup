import {fireEvent, screen} from '@testing-library/dom'
import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import wireUp from '../js/main'

let indexRaw;
let index;

afterEach(()=>{
  let {inputs}= wireUp()
  inputs.newGame()
})

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

  //
  document.body.innerHTML= (await getIndexHtml()).body.innerHTML
  const expectedBoards=["Board 1"]

  // expect
  for(let boardName of expectedBoards){
    const board= screen.getByRole("grid", {name: boardName})
    const expectedLabels= document.querySelectorAll("[role='gridcell'] label",board)
    const topLeft = screen.getAllByRole("gridcell",
        {name:boardName + " Top Left"})
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
  wireUp()
  //
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 Top Left'})
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('X')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')
})

test('Clicking two squares on an empty game plays the first two moves', async()=>{
  const user = userEvent.setup()
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  wireUp()
  //
  let topMiddle = screen.getByRole("gridcell", {name:'Board 1 Top Middle'})
  await user.click(topMiddle)
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 Top Left'})
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('O')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')

})

test('Clicking a square a second time has no effect', async()=>{
  const user = userEvent.setup()
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  let {inputs,outputs} = wireUp()
  //
  let topLeft = screen.getByRole("gridcell", {name:'Board 1 Top Left'})
  await user.click(topLeft)
  await user.click(topLeft)
  //
  expect(topLeft.innerHTML).toContain('X')
  expect(topLeft.innerHTML).not.toContain('&nbsp;')
  expect(topLeft.innerHTML).not.toContain('O')
})

test('Clicking a won game has no effect', async ()=>{
  const user = userEvent.setup()
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  let {inputs,outputs} = wireUp()

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=0; i<7; i++){
    await user.click(inputs.board1[i])
  }
  //
  await user.click(inputs.board1[0])
  expect(inputs.board1[0].innerHTML).toContain('X')
  await user.click(inputs.board1[7])
  expect(inputs.board1[7].innerHTML).toContain('&nbsp;')
})
