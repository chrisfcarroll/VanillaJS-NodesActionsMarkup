const nineOxoBoardsSelector="div[role=grid].three-by-three"
const nineOxoBoardsAllCellsSelector=".oxo-board-section div[role=gridcell]"
export const nineBoardsDomNode = ()=>document.querySelector(nineOxoBoardsSelector)
export const nineOxoBoardsAllCellsDomNodes =
      () => nineBoardsDomNode().querySelectorAll(nineOxoBoardsAllCellsSelector)


export function assertDomNode() {
  console.assert(nineBoardsDomNode(), 'nineOxoBoardsSelector ' + nineOxoBoardsSelector + ' isn\'t an HTML Node')
}
