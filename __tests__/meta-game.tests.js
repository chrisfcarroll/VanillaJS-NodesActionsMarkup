import '@jest/globals'
import '@testing-library/jest-dom'
import OxoGame from '../js/oxo-game'

test('Each oxo-game recognises win and not won', ()=>{

    let game= new OxoGame()
    for(let i=0; i<6; i++){
      const currentPlayer=game.playerOnMove
      game.playMove(i)
      expect(game.boardModel[i]).toBe(currentPlayer)
      expect(game.playerOnMove).not.toBe(currentPlayer)
      expect(game.winLine).toBeUndefined()
      expect(game.winner).toBeUndefined()
    }
    let lastMove=game.playerOnMove
    game.playMove(6)
    expect(game.boardModel[6]).toBe(lastMove)
    expect(game.winLine).toEqual([2,4,6])
    expect(game.winner).toBe(lastMove)
})
