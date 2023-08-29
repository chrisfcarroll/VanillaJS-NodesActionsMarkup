import {nineOxoBoardsDomNode} from './NodesAndActions-nine-oxo-games.js'
export const oxoBoardSectionTemplateId="oxo-board-section-template"

function placeOxoBoard(boardNumber){
  const template=document
    .getElementById(oxoBoardSectionTemplateId)

  const templatedContent= template.content.firstElementChild.innerHTML
          .replaceAll('board0','board' + boardNumber)
          .replaceAll('Board 0','Board ' + boardNumber)
          .replaceAll('board 0','cells ' + boardNumber)

  nineOxoBoardsDomNode().insertAdjacentHTML("beforeend", `<section class="oxo-board-section">${templatedContent}</section>`)
}

export default placeOxoBoard
