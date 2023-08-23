import '@jest/globals'
import '@testing-library/jest-dom'
import {screen} from '@testing-library/dom'
import {promises as fs} from 'fs'

let indexRaw;
let index;

test('jest runs', ()=>{
  expect(true).toBeTruthy()
})

test('testing-library and jest-dom runs', ()=>{

  document.body.innerHTML ="<button>Press</button>";
  const button=screen.getByText('Press')
  expect(button).toBeVisible()
})

test('can load index.html', async ()=> {

  const indexRaw= (await fs.readFile('index.html')).toString()
  const index= new DOMParser().parseFromString(indexRaw,"text/html")
  document.body.innerHTML=index.body.innerHTML
  expect(document.body).toBeVisible()
})

async function getIndexHtml(){
  indexRaw= indexRaw || (await fs.readFile('index.html')).toString()
  index= index || new DOMParser().parseFromString(indexRaw,"text/html")
  return index
}

test('Game Board 1 renders', async ()=> {

  document.body.innerHTML= (await getIndexHtml()).body.innerHTML
  const board= screen.getByRole("grid", {name: "Board 1"})
  expect(board).toBeVisible()
})

test('Game Board 1 renders nine cells Top Left to Bottom Right', async ()=> {

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
