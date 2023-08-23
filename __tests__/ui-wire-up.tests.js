import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
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
  // noinspection JSUnusedLocalSymbols
  const {
    container9By9,
    containerMetaGame ,
    metaGame,
    oxoBoards
  } = createBoardsAndWireUpAll();
  expect(window.moveQueue).toBeDefined()

  let {inputs} = oxoBoards[1]

  //Playing the first seven cells in order from top left is a win for player 1
  for(let i=0; i<7; i++){
    await user.click(inputs.board[i])
  }
  //
  expect(metaGame.metaGame.boardModel[0]).toBe('X')
})

// test('New Game button starts new games', async ()=>{
//   const user = userEvent.setup()
//   document.outerHTML=(await getIndexHtml()).outerHTML
//   // noinspection JSUnusedLocalSymbols
//   const {
//     container9By9,
//     containerMetaGame ,
//     metaGame,
//     oxoBoards,
//     clearButton
//   } = createBoardsAndWireUpAll();
//
//   //Playing the first seven cells in order from top left is a win for player 1
//   for(let i=0; i < 7; i++){
//     await user.click(oxoBoards[1].inputs.board[i])
//   }
//   expect(metaGame.metaGame.boardModel[0]).toBe('X')
//   for(let i= 2; i <= 9 ; i++){
//     await user.click( oxoBoards[i].inputs.board[i])
//   }
//
//   await user.click(clearButton)
//
//   for(let square of metaGame.metaGame.boardModel){
//       expect(square).toBe(unplayedSquare)
//   }
//   expect(metaGame.metaGame.boardModel.length).toBe(9)
//
// })
