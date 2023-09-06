const oxoBoardSectionTemplateId="oxo-board-section-template"

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
