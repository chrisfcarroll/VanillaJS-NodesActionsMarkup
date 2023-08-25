import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import createGameModelsPlaceBoardsWireUpAll from '../js/create-game-models-place-boards-wire-up-all'
import {unplayedSquare} from '../js/oxo-game'
import {allBoardCellsSelector, allMetagameCellSelector} from '../js/wire-up-oxo-board'

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

const winForOinGame1 = [
    {game: 1, player: "x", playedAt: 1},
    {game: 1, player: "O", playedAt: 2},
    {game: 2, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 5},
    {game: 5, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 8}
  ]

test('New Game button starts new games', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    container3by3,
    containerMetaGame ,
    metaGame,
    oxoBoards,
    newGameButton
  } = createGameModelsPlaceBoardsWireUpAll();

  await givenAWinForOonBoard1()
  await givenSomeMoreMoves()
  await user.click(newGameButton)

  for(let square of metaGame.metaGame.boardModel){
      expect(square).toBe(unplayedSquare)
  }
  for(let game of metaGame.games.filter(g=>g))for(let square of game.boardModel.filter(b=>b)){
    expect(square).toBe(unplayedSquare)
  }

  async function givenAWinForOonBoard1() {
    for (let move of winForOinGame1) {
      await user.click(oxoBoards[move.game].cells[move.playedAt - 1])
    }
    expect(metaGame.metaGame.boardModel[1]).toBe('O')
  }
  async function givenSomeMoreMoves() {
    for (let i = 2; i <= 9; i++) {
      await user.click(oxoBoards[metaGame.nextBoard].cells[i - 1])
    }
  }
})

test('New Game button clears all squares', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    container3by3,
    containerMetaGame ,
    metaGame,
    oxoBoards,
    newGameButton
  } = createGameModelsPlaceBoardsWireUpAll();

  await givenAWinOnBoard1ForO()
  await givenSomeMoreMoves()
  await user.click(newGameButton)

  for(let square of container3by3.querySelectorAll(allBoardCellsSelector)){
      expect(square.innerHTML).toContain('&nbsp;')
  }
  for(let square of containerMetaGame.querySelectorAll(allMetagameCellSelector)){
      expect(square.innerHTML).toContain('&nbsp;')
  }

  async function givenAWinOnBoard1ForO() {
    for (let move of winForOinGame1) {
      await user.click(oxoBoards[move.game].cells[move.playedAt - 1])
    }
    expect(metaGame.metaGame.boardModel[1]).toBe('O')
  }
  async function givenSomeMoreMoves() {
    for (let i = 2; i <= 9; i++) {
      await user.click(oxoBoards[metaGame.nextBoard].cells[i - 1])
    }
  }
})

test('After pressing New Game button everything is wired up again', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    container3by3,
    containerMetaGame ,
    metaGame,
    oxoBoards,
    newGameButton
  } = createGameModelsPlaceBoardsWireUpAll();

  await user.click(newGameButton)
  await verifyWinForOonBoard1()
  await verifySomeMoreMoves()

  async function verifyWinForOonBoard1() {
    for (let move of winForOinGame1) {
      await user.click(oxoBoards[move.game].cells[move.playedAt - 1])
    }
    expect(metaGame.metaGame.boardModel[1]).toBe('O')
  }
  async function verifySomeMoreMoves() {
    for (let i = 2; i <= 9; i++) {
      await user.click(oxoBoards[metaGame.nextBoard].cells[i - 1])
      expect(metaGame.metaGame.boardModel[i]).toBe(unplayedSquare)
    }
  }
})
