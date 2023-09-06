import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import createGameModelsPlaceBoardsWireUpAll from '../js/create-game-models-place-boards-wire-up-all'
import {cellsByBoardNumberDomNodes} from '../js/NodesAndActions-oxo-board'
import {gameDomNode} from '../js/NodesAndActions-metagame'

let indexRaw
let index
let hasDoneInnerHTMLChickenDance=false
window =  window || {}

const winGame1ForO = [
    {game: 1, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 2},
    {game: 2, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 5},
    {game: 5, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 8}
  ]

const winMetaGameForO = [
    {game: 1, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 2},
    {game: 2, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 5},
    {game: 5, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 8},
    {game: 8, player: "X", playedAt: 4},
    {game: 4, player: "O", playedAt: 5},
    {game: 5, player: "X", playedAt: 4},
    {game: 4, player: "O", playedAt: 6},
    {game: 6, player: "X", playedAt: 4},
    {game: 4, player: "O", playedAt: 4},
    {game: 5, player: "X", playedAt: 7},
    {game: 7, player: "O", playedAt: 7},
    {game: 7, player: "X", playedAt: 4},
    {game: 7, player: "O", playedAt: 5},
    {game: 7, player: "X", playedAt: 8},
    {game: 8, player: "O", playedAt: 7},
    {game: 7, player: "X", playedAt: 3},
    {game: 3, player: "O", playedAt: 3},
    {game: 3, player: "X", playedAt: 7},
    {game: 7, player: "O", playedAt: 1},
    {game: 9, player: "X", playedAt: 7},
    {game: 7, player: "O", playedAt: 9}
]

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
    metaGame,
    metaGameNodesActions,
    oxoBoardsNodesActionsList,
    newGameButtonNA
  } = createGameModelsPlaceBoardsWireUpAll();
  expect(window.moveQueue).toBeDefined()

  for(let move of winGame1ForO){
    await user.click( oxoBoardsNodesActionsList[move.game].nodes.cells[move.playedAt - 1] )
  }

  //
  expect(metaGame.metaGame.boardModel[1]).toBe('O')
})


test('Winning the metaGame shows game-over style', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    metaGame,
    metaGameNodesActions,
    oxoBoardsNodesActionsList,
    newGameButtonNA
  } = createGameModelsPlaceBoardsWireUpAll();
  expect(window.moveQueue).toBeDefined()

  for(let move of winMetaGameForO){
    await user.click( oxoBoardsNodesActionsList[move.game].nodes.cells[move.playedAt - 1] )
  }

  //
  expect(metaGame.metaGame.winLine).toBeDefined()
  expect(metaGameNodesActions.nodes.game.classList).toContain('game-over')

})
