import '@jest/globals'
import '@testing-library/jest-dom'
import OxoGame from '../js/oxo-game'

test('OxoGame recognises win and not won', ()=>{

    let game= new OxoGame([])
    for(let i=1; i <= 6; i++){
      const currentPlayer=game.playerOnMove
      game.playMove(i)
      expect(game.boardModel[i]).toBe(currentPlayer)
      expect(game.playerOnMove).not.toBe(currentPlayer)
      expect(game.winLine).toBeUndefined()
      expect(game.winner).toBeUndefined()
    }
    let lastMove=game.playerOnMove
    game.playMove(7)
    expect(game.boardModel[7]).toBe(lastMove)
    expect(game.winLine).toEqual([3,5,7])
    expect(game.winner).toBe(lastMove)
})

describe('OxoGame records move in a global queue', ()=>{
  test('For all moves', ()=>{
      const queue= []
      let game= new OxoGame(queue)
      for(let i=1; i<=6; i++){
        const currentPlayer=game.playerOnMove
        const queueLengthWas=queue.length
        game.playMove(i)
        expect(queue.length).toBe(queueLengthWas + 1)
        expect(queue[queue.length-1]).toEqual({game:game.name, player:currentPlayer, playedAt:i})
      }
      let lastMove=game.playerOnMove
      game.playMove(7)
      expect(queue.length).toBe(7)
      expect(queue[6]).toEqual({game:game.name, player:lastMove, playedAt:7})
  })
  test('but still ignores invalid moves', ()=>{
      const queue= []
      let game= new OxoGame(queue)
      for(let i=1; i<=7; i++){
        const currentPlayer=game.playerOnMove
        const queueLengthWas=queue.length
        //
        game.playMove(i)
        game.playMove(i)
        //
        expect(queue.length).toBe(queueLengthWas + 1)
        expect(queue[queue.length-1]).toEqual({game:game.name, player:currentPlayer, playedAt:i})
      }
      game.playMove(1)
      expect(queue.length).toBe(7)
  })
})
