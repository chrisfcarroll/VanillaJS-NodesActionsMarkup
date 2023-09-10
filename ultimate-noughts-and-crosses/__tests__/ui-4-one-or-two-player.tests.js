import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'
import {screen} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import createGameModelsPlaceBoardsWireUpAll from '../js/create-game-models-place-boards-wire-up-all'
import {gameStewardNA} from '../js/NodesAndActions-game-steward'

let indexRaw
let indexHtml
let hasDoneInnerHTMLChickenDance=false

async function getIndexHtml(){
  indexRaw= indexRaw || (await fs.readFile('index.html')).toString()
  indexHtml= indexHtml || new DOMParser().parseFromString(indexRaw,"text/html")
  return indexHtml
}

beforeEach( async () => {
  if(hasDoneInnerHTMLChickenDance)return
  document.body.innerHTML=(await getIndexHtml()).body.innerHTML
  hasDoneInnerHTMLChickenDance=true;
})

test('smoke: there are radiobuttons for players X,O is human,computer', async()=>{

    expect(gameStewardNA.nodes.playerXisHuman()).toBeDefined()
    expect(gameStewardNA.nodes.playerOisHuman()).toBeDefined()
    expect(gameStewardNA.nodes.playerXisComputer()).toBeDefined()
    expect(gameStewardNA.nodes.playerOisComputer()).toBeDefined()
})

describe('GameSteward knows which player(s) is computer and which human', () => {

  test('Given you pressed PlayerX is Computer and Player O is human', async () => {

    const user = userEvent.setup()
    document.outerHTML = (await getIndexHtml()).outerHTML

    if(document.body.querySelectorAll("[hidden] [name=playerXis],[hidden] [name=playerOis]").length){
      console.warn("Human/Computer buttons are hidden so they can't be tested")
      return
    }

    // noinspection JSUnusedLocalSymbols
    const {
      metaGame,
      oxoBoardsNodesActionsList,
      newGameButtonNA,
      gameStewardNA
    } = createGameModelsPlaceBoardsWireUpAll();

    await user.click(screen.getByRole('radio', {name:"Player X is Human"}))
    await user.click(screen.getByRole('radio', {name:"Player O is Computer"}))

    expect(gameStewardNA.inputs.playerXis).toBe("human")
    expect(gameStewardNA.inputs.playerOis).toBe("computer")

  })

  test.each([
    {X:"Human", O:"Human"},
    {X:"Human", O:"Computer"},
    {X:"Computer", O:"Computer"},
    {X:"Computer", O:"Human"},
  ])('Given you pressed %s', async (testcase) => {

    const user = userEvent.setup()
    document.outerHTML = (await getIndexHtml()).outerHTML

    if(document.body.querySelectorAll("[hidden] [name=playerXis],[hidden] [name=playerOis]").length){
      console.warn("Human/Computer buttons are hidden so they can't be tested")
      return
    }

    // noinspection JSUnusedLocalSymbols
    const {
      metaGame,
      oxoBoardsNodesActionsList,
      newGameButtonNA,
      gameStewardNA
    } = createGameModelsPlaceBoardsWireUpAll();

    await user.click(screen.getByRole('radio', {name:`Player X is ${testcase.X}`}))
    await user.click(screen.getByRole('radio', {name:`Player O is ${testcase.O}`}))

    expect(gameStewardNA.inputs.playerXis).toBe(testcase.X.toLowerCase())
    expect(gameStewardNA.inputs.playerOis).toBe(testcase.O.toLowerCase())

  })
})

test('Game stewards plays the computer', ()=>{

})
