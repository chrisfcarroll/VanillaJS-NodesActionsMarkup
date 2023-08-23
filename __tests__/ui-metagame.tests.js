import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import createMetaGameAndPlaceBoardsAndWireUpAll from '../js/create-meta-game-and-place-boards-and-wire-up-all'

let indexRaw
let index
let hasDoneInnerHTMLChickenDance=false
window =  window || {}

async function getIndexHtml(){
  indexRaw= indexRaw || (await fs.readFile('index.html')).toString()
  index= index || new DOMParser().parseFromString(indexRaw,"text/html")
  return index
}

beforeEach( async () => {
  if(hasDoneInnerHTMLChickenDance)return
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  hasDoneInnerHTMLChickenDance=true;
})

test('Winning a game plays the right move in the metagame', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    container9By9,
    containerMetaGame ,
    metaGame,
    oxoBoards
  } = createMetaGameAndPlaceBoardsAndWireUpAll();
  expect(window.moveQueue).toBeDefined()

  let board = oxoBoards[1]

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=1; i <= 7; i++){
    await user.click(board.cells[i-1])
  }
  //
  expect(metaGame.metaGame.boardModel[1]).toBe('X')
})
