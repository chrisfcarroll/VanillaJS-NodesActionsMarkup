import {otherPlayer} from './Oxo-game.js'

const radioXisHumanSelector    = "input[name=playerXis][type=radio][value=human]"
const playerXisComputerSelector = "input[name=playerXis][type=radio][value=computer]"
const playerOisHumanSelector    = "input[name=playerOis][type=radio][value=human]"
const playerOisComputerSelector = "input[name=playerOis][type=radio][value=computer]"

const playerXisSelector    = "input[name=playerXis][type=radio]:checked"
const playerOisSelector    = "input[name=playerOis][type=radio]:checked"
const setPlayerSelector = "input[name=player${XorO}is][type=radio][value=${value}]"

export const humanOrComputerChanged="Human or Computer Changed"

function setPlayer(XorO, humanOrComputer) {
  if (humanOrComputer !== 'human' && humanOrComputer !== 'computer') {
    console.error(
      `tried to set gameStewardNA.inputs.player${XorO}is=${humanOrComputer} which isn't 'human' or 'computer'`)
    return
  }
  document.querySelector(
    setPlayerSelector
      .replace("${XorO}", XorO)
      .replace("${value}", humanOrComputer)).checked = true
}

export const gameStewardNA={
  nodes : {
    radioXisHuman : ()=> document.querySelector(radioXisHumanSelector),
    radioXisComputer : ()=> document.querySelector(playerXisComputerSelector),
    radioOisHuman : ()=> document.querySelector(playerOisHumanSelector),
    radioOisComputer : ()=> document.querySelector(playerOisComputerSelector),
    groupXisHumanOrComputer : ()=>document.getElementById("fieldset-player-X-is-played-by"),
    groupOisHumanOrComputer : ()=>document.getElementById("fieldset-player-O-is-played-by"),
    getGroupIsPlayedBy : function(XorO){
      return document.getElementById(`fieldset-player-${XorO}-is-played-by`)
    }
  },
  inputs :{
    get playerXis(){ return document.querySelector(playerXisSelector).value},
    setPlayerXis: function(humanOrComputer){ setPlayer('X', humanOrComputer)},
    get playerOis(){ return document.querySelector(playerOisSelector).value},
    setPlayerOis: function(humanOrComputer){ setPlayer('O', humanOrComputer)},
    player: function(XorO){
      switch (XorO) {
        case 'X' : return gameStewardNA.inputs.playerXis
        case 'O' : return gameStewardNA.inputs.playerOis
        default: console.error(`GameStewardNA.inputs.player(XorO) was called with ${XorO} which isn't an X or O`)
      }
    }
  }
}

let hasWiredGameSteward=false;

export function wireUpGameSteward(){
  if(hasWiredGameSteward)return;
  hasWiredGameSteward=true
  for (const [name, node] of Object.entries(gameStewardNA.nodes)) {
    if (name.match(/^radio[XO].+/)) {
      node().addEventListener('click', (e) => {
        console.log(e.target.name, e.target.value)
        if (window.uiMoveQueue) {
          window.uiMoveQueue.push({[e.target.name]: e.target.value})
        }
      })
    }
  }
  window.gameLog.addObserver("GameSteward", e => {
    if (e.method !== 'push') return;
    console.info("Game Steward heard", e)
    //
    // noinspection JSUnusedLocalSymbols
    const {game, playedAt, player} = e.action
    if (player) {
      gameStewardNA.nodes.getGroupIsPlayedBy(player).classList.remove("your-turn")
      gameStewardNA.nodes.getGroupIsPlayedBy(otherPlayer(player)).classList.add("your-turn")
    }
  })
}

export const assertDomNodes = function(){
  for(const [name,node] of Object.entries( gameStewardNA.nodes)){
    if(name.match(/(^radio[XO]|^group[XO])/)) {
      console.assert(node(), `Expected gameSteward node.${name} to be in the markup`, node)
    }
  }
}
