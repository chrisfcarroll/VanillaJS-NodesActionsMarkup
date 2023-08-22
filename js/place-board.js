function placeBoard(boardNumber,container){
  const template=document
    .getElementById("oxo-board-section-template")

  const templatedContent= template.content.firstElementChild.innerHTML
          .replaceAll('board0','board' + boardNumber)
          .replaceAll('Board 0','Board ' + boardNumber)
          .replaceAll('board 0','board ' + boardNumber)

  container.insertAdjacentHTML("beforeend", `<section class="oxo-board-section">${templatedContent}</section>`)
}

export default placeBoard
