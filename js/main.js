import OxoBoardInputs from './oxo-board-io.js'

const games=[]
const boards=[]

function inputs(boardNumber) {

  if(!boards[boardNumber]){
    boards[boardNumber]= new OxoBoardInputs(boardNumber)
  }
  return boards[boardNumber]
}

function outputs(boardNumber){
  return {

  }
}

export default function wireUp(boardNumber){
  return { inputs :  inputs(boardNumber), outputs: outputs(boardNumber) }
}
