import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import createGameModelsPlaceBoardsWireUpAll from '../js/create-game-models-place-boards-wire-up-all'
import {unplayedSquare} from '../js/oxo-game'
import {allBoardCellsSelector, allMetagameCellSelector} from '../js/oxo-board-wire-up'

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

test('New Game button starts new games', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    container9By9,
    containerMetaGame ,
    metaGame,
    oxoBoards,
    clearButton
  } = createGameModelsPlaceBoardsWireUpAll();

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=1; i <= 7; i++){
    await user.click(oxoBoards[1].cells[i-1])
  }
  expect(metaGame.metaGame.boardModel[1]).toBe('X')
  for(let i= 2; i <= 9 ; i++){
    await user.click( oxoBoards[i].cells[i-1])
  }

  await user.click(clearButton)

  for(let square of metaGame.metaGame.boardModel){
      expect(square).toBe(unplayedSquare)
  }
})

test('New Game button clears all squares', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    container9By9,
    containerMetaGame ,
    metaGame,
    oxoBoards,
    clearButton
  } = createGameModelsPlaceBoardsWireUpAll();

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=1; i <= 7; i++){
    await user.click(oxoBoards[1].cells[i-1])
  }
  expect(metaGame.metaGame.boardModel[1]).toBe('X')
  for(let i= 2; i <= 9 ; i++){
    await user.click( oxoBoards[i].cells[i-1])
  }
  await user.click(clearButton)

  for(let square of container9By9.querySelectorAll(allBoardCellsSelector)){
      expect(square.innerHTML).toContain('&nbsp;')
  }
  for(let square of containerMetaGame.querySelectorAll(allMetagameCellSelector)){
      expect(square.innerHTML).toContain('&nbsp;')
  }
})

test('After pressing New Game button everything is wired up again', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    container9By9,
    containerMetaGame ,
    metaGame,
    oxoBoards,
    clearButton
  } = createGameModelsPlaceBoardsWireUpAll();

  await user.click(clearButton)

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=1; i <= 7; i++){
    await user.click(oxoBoards[1].cells[i-1])
  }
  expect(metaGame.metaGame.boardModel[1]).toBe('X')

  for(let i= 2; i <= 9 ; i++){
    await user.click( oxoBoards[i].cells[i-1])
    expect(metaGame.metaGame.boardModel[i]).toBe(unplayedSquare)
  }
})
