import {screen} from '@testing-library/dom'
import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import {wireUpOxoBoard} from '../js/oxo-board-io'
import OxoGame from '../js/oxo-game'
import createBoardsAndWireUpAll from '../js/create-boards-and-wire-up-all'

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
  const {
    container9By9,
    containerMetaGame ,
    metaGame,
    oxoBoards
  } = createBoardsAndWireUpAll();
  expect(window.moveQueue).toBeDefined()

  let {inputs,outputs} = oxoBoards[1]

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=0; i<7; i++){
    await user.click(inputs.board[i])
  }
  //
  expect(metaGame.metaGame.boardModel[0]).toBe('X')
})
