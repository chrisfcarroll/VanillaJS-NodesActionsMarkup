import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import userEvent from '@testing-library/user-event'
import createGameModelsPlaceBoardsWireUpAll from '../js/create-game-models-place-boards-wire-up-all'
import {unplayedSquare} from '../js/Oxo-game'
import { nineOxoBoardsAllCellsDomNodes} from '../js/Nodes-nine-boards'
import {gameStewardNA} from '../js/NodesAndActions-game-steward'
import {NewGameAction} from '../js/NodesAndActions-new-game-button'
let indexRaw
let indexHtml
let hasDoneInnerHTMLChickenDance=false
window =  window || {}

async function getIndexHtml(){
  indexRaw= indexRaw || (await fs.readFile('index.html')).toString()
  indexHtml= indexHtml || new DOMParser().parseFromString(indexRaw,"text/html")
  return indexHtml
}

beforeEach( async () => {
  if(hasDoneInnerHTMLChickenDance)return
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  hasDoneInnerHTMLChickenDance=true;

  gameStewardNA.inputs.setPlayerXis('human')
  gameStewardNA.inputs.setPlayerOis('human')

})

const winForOinGame1 = [
    {game: 1, player: "X", playedAt: 1},
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
    metaGame,
    metaGameNodesActions,
    oxoBoardsNodesActionsList,
    newGameButtonNA
  } = createGameModelsPlaceBoardsWireUpAll();

  await givenAWinForOonBoard1()
  await givenSomeMoreMoves()
  await user.click(newGameButtonNA.node)

  for(let square of metaGame.metaGame.boardModel){
      expect(square).toBe(unplayedSquare)
  }
  for(let game of metaGame.games.filter(g=>g))for(let square of game.boardModel.filter(b=>b)){
    expect(square).toBe(unplayedSquare)
  }

  async function givenAWinForOonBoard1() {
    for (let move of winForOinGame1) {
      await user.click( oxoBoardsNodesActionsList[move.game].nodes.cells[move.playedAt - 1])
    }
    expect(metaGame.metaGame.boardModel[1]).toBe('O')
  }
  async function givenSomeMoreMoves() {
    for (let i = 2; i <= 9; i++) {
      await user.click( oxoBoardsNodesActionsList[metaGame.nextBoard].nodes.cells[i - 1])
    }
  }
})

test('New Game button clears all squares', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    metaGame,
    metaGameNodesActions,
    oxoBoardsNodesActionsList,
    newGameButtonNA
  } = createGameModelsPlaceBoardsWireUpAll();

  await givenAWinOnBoard1ForO()
  await givenSomeMoreMoves()
  await user.click(newGameButtonNA.node)

  for(let square of nineOxoBoardsAllCellsDomNodes()){
      expect(square.innerHTML).toContain('&nbsp;')
  }
  for(let square of metaGameNodesActions.nodes.metaGameAllCells){
      expect(square.innerHTML).toContain('&nbsp;')
  }

  async function givenAWinOnBoard1ForO() {
    for (let move of winForOinGame1) {
      await user.click( oxoBoardsNodesActionsList[move.game].nodes.cells[move.playedAt - 1])
    }
    expect(metaGame.metaGame.boardModel[1]).toBe('O')
  }
  async function givenSomeMoreMoves() {
    for (let i = 2; i <= 9; i++) {
      await user.click( oxoBoardsNodesActionsList[metaGame.nextBoard].nodes.cells[i - 1])
    }
  }
})

test('New game button pushes new game event to uiMoveQueue', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    metaGame,
    metaGameNodesActions,
    oxoBoardsNodesActionsList,
    newGameButtonNA
  } = createGameModelsPlaceBoardsWireUpAll();

  await user.click(newGameButtonNA.node)

  expect(window.uiMoveQueue.length).toBe(1)
  expect(window.uiMoveQueue[0]).toEqual(NewGameAction)
})

test('After pressing New Game button everything is wired up again', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    metaGame,
    oxoBoardsNodesActionsList,
    newGameButtonNA
  } = createGameModelsPlaceBoardsWireUpAll();

  await user.click(newGameButtonNA.node)
  await verifyWinForOonBoard1()
  await verifySomeMoreMoves()

  async function verifyWinForOonBoard1() {
    for (let move of winForOinGame1) {
      await user.click( oxoBoardsNodesActionsList[move.game].nodes.cells[move.playedAt - 1] )
    }
    expect(metaGame.metaGame.boardModel[1]).toBe('O')
  }
  async function verifySomeMoreMoves() {
    for (let i = 2; i <= 9; i++) {
      await user.click( oxoBoardsNodesActionsList[metaGame.nextBoard].nodes.cells[i - 1])
      expect(metaGame.metaGame.boardModel[i]).toBe(unplayedSquare)
    }
  }
})

test('After pressing New Game button GameSteward UI is reset', async ()=>{
  const user = userEvent.setup()
  document.outerHTML=(await getIndexHtml()).outerHTML
  // noinspection JSUnusedLocalSymbols
  const {
    metaGame,
    oxoBoardsNodesActionsList,
    newGameButtonNA
  } = createGameModelsPlaceBoardsWireUpAll();

  await user.click(oxoBoardsNodesActionsList[1].nodes.cells[0])

  await user.click(newGameButtonNA.node)

  expect(gameStewardNA.nodes.getGroupIsPlayedBy('X').classList).toContain('your-turn')
  expect(gameStewardNA.nodes.getGroupIsPlayedBy('O').classList).not.toContain('your-turn')

})
