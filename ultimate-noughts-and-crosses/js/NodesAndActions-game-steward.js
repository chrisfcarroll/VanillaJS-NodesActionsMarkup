const playerXisHumanSelector    = "input[name=playerXis][type=radio][value=human]"
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
    playerXisHuman : ()=> document.querySelector(playerXisHumanSelector),
    playerXisComputer : ()=> document.querySelector(playerXisComputerSelector),
    playerOisHuman : ()=> document.querySelector(playerOisHumanSelector),
    playerOisComputer : ()=> document.querySelector(playerOisComputerSelector)
  },
  inputs :{
    get playerXis(){ return document.querySelector(playerXisSelector).value},
    set playerXis(humanOrComputer){ setPlayer('X', humanOrComputer)},
    get playerOis(){ return document.querySelector(playerOisSelector).value},
    set playerOis(humanOrComputer){ setPlayer('O', humanOrComputer)},
    player: function(XorO){
      switch (XorO) {
        case 'X' : return gameStewardNA.inputs.playerXis
        case 'O' : return gameStewardNA.inputs.playerOis
        default: console.error(`GameStewardNA.inputs.player(XorO) was called with ${XorO} which isn't an X or O`)
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  for(const [_,node] of Object.entries( gameStewardNA.nodes)){
    node().addEventListener('click', (e)=>{
      console.log(e.target.name,e.target.value)
      if(window.uiMoveQueue){
        window.uiMoveQueue.push({[e.target.name]:e.target.value})
      }
    })
  }
})

export const assertDomNodes = function(){
  for(const [name,node] of Object.entries( gameStewardNA.nodes)){
    console.assert(node(), `Expected gameSteward node.${name} to be in the markup`,node)
  }
}
