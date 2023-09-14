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

  test.each([
    {X:"Human", O:"Human"},
    {X:"Human", O:"Computer"},
    {X:"Computer", O:"Computer"},
    {X:"Computer", O:"Human"},
  ])('Given you pressed %s', async (testcase) => {

    const user = userEvent.setup()
    document.outerHTML = (await getIndexHtml()).outerHTML

    if(document.body.querySelectorAll("[hidden] [name=playerXis],[hidden] [name=playerOis]").length){
      console.info("Human/Computer buttons are hidden in the markup, unhiding for test.")
      for(let node of document.body.querySelectorAll("[data-testid=human-computer-radiogroups][hidden]")){
        node.attributes.removeNamedItem("hidden")
      }
    }

    // noinspection JSUnusedLocalSymbols
    const {
      metaGame,
      oxoBoardsNodesActionsList,
      newGameButtonNA
    } = createGameModelsPlaceBoardsWireUpAll();

    await user.click(screen.getByRole('radio', {name:`Player X is ${testcase.X}`}))
    await user.click(screen.getByRole('radio', {name:`Player O is ${testcase.O}`}))

    expect(gameStewardNA.inputs.playerXis).toBe(testcase.X.toLowerCase())
    expect(gameStewardNA.inputs.playerOis).toBe(testcase.O.toLowerCase())

  })
})

describe('ComputerPlayer plays on board', ()=>{

  test('Given GameSteward says there is a computer player', async () => {

    document.outerHTML = (await getIndexHtml()).outerHTML
    // noinspection JSUnusedLocalSymbols
    const { metaGame,
            metaGameNodesActions,
            oxoBoardsNodesActionsList,
            newGameButtonNA } = createGameModelsPlaceBoardsWireUpAll()
    gameStewardNA.inputs.playerXis = 'human'
    gameStewardNA.inputs.playerOis = 'computer'

    oxoBoardsNodesActionsList[1].clickSquare(1)

    expect(window.gameLog.length).toBe(2)

    const {game,playedAt} = window.gameLog[1]
    expect({game,playedAt}).not.toEqual({game:metaGame.games[1].name, playedAt:1})

  })

})
