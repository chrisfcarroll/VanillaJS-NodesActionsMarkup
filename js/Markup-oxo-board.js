const oxoBoardSectionTemplateId="oxo-board-section-template"

/*
this approach uses Templates in the markup
*/
export function insertOxoBoardHtml(boardNumber, container){
  const template=document
    .getElementById(oxoBoardSectionTemplateId)

  const templatedContent= template.content.firstElementChild.innerHTML
          .replaceAll('board0','board' + boardNumber)
          .replaceAll('Board 0','Board ' + boardNumber)
          .replaceAll('board 0','cells ' + boardNumber)

  container.insertAdjacentHTML("beforeend", `<section class="oxo-board-section">${templatedContent}</section>`)
  return container
}

/*
Or this approach uses html inline in the function
*/

// noinspection JSUnusedLocalSymbols
function insertOxoBoardHtmlAlternateVersion(boardNumber, container){

  const templatedContent= `<section class="oxo-board-section">
      <div role="grid" class="oxo-board" aria-label="Board 0" id="board0">
        <div role="gridcell" id="board0-cell-1" aria-labelledby="board0 board0-cell-1">
          <label>top left</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-2"  aria-labelledby="board0 board0-cell-2">
          <label>top middle</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-3"  aria-labelledby="board0 board0-cell-3">
          <label>top right</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-4" aria-labelledby="board0 board0-cell-4">
          <label>middle left</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-5"  aria-labelledby="board0 board0-cell-5">
          <label>middle square</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-6"  aria-labelledby="board0 board0-cell-6">
          <label>middle right</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-7" aria-labelledby="board0 board0-cell-7">
          <label>bottom left</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-8"  aria-labelledby="board0 board0-cell-8">
          <label>bottom middle</label>&nbsp;</div>
        <div role="gridcell" id="board0-cell-9"  aria-labelledby="board0 board0-cell-9">
          <label>bottom right</label>&nbsp;</div>
      </div>
    </section>`
          .replaceAll('board0','board' + boardNumber)
          .replaceAll('Board 0','Board ' + boardNumber)
          .replaceAll('board 0','cells ' + boardNumber)

  container.insertAdjacentHTML("beforeend", `<section class="oxo-board-section">${templatedContent}</section>`)
  return container
}
