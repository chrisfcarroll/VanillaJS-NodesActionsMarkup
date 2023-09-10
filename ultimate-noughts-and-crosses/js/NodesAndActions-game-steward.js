const playerXisHumanSelector    = "input[name=playerXis][type=radio][value=human]"
const playerXisComputerSelector = "input[name=playerXis][type=radio][value=computer]"
const playerOisHumanSelector    = "input[name=playerOis][type=radio][value=human]"
const playerOisComputerSelector = "input[name=playerOis][type=radio][value=computer]"

const playerXisSelector    = "input[name=playerXis][type=radio]:checked"
const playerOisSelector    = "input[name=playerOis][type=radio]:checked"


export const gameStewardNA={
  nodes : {
    playerXisHuman : ()=> document.querySelector(playerXisHumanSelector),
    playerXisComputer : ()=> document.querySelector(playerXisComputerSelector),
    playerOisHuman : ()=> document.querySelector(playerOisHumanSelector),
    playerOisComputer : ()=> document.querySelector(playerOisComputerSelector)
  },
  inputs :{
    get playerXis(){ return document.querySelector(playerXisSelector).value},
    get playerOis(){ return document.querySelector(playerOisSelector).value}
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  for(const [name,node] of Object.entries( gameStewardNA.nodes)){
    node().addEventListener('click', (e)=>{console.log(e.target.name,e.target.value)})
  }
})

export const assertDomNodes = function(){
  for(const [name,node] of Object.entries( gameStewardNA.nodes)){
    console.assert(node(), `Expected gameSteward node.${name} to be in the markup`,node)
  }
}
