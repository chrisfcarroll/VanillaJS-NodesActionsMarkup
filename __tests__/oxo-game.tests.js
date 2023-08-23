import '@jest/globals'
import '@testing-library/jest-dom'
import OxoGame, {unplayedSquare} from '../js/oxo-game'
import ObservablePushQueue from '../js/observable-push-queue'
import UltimateOxoGame from '../js/ultimate-oxo-game'

test('OxoGame recognises win and not won', ()=>{

    let game= new OxoGame([])
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

describe('OxoGame records move in a global queue', ()=>{
  test('For all moves', ()=>{
      const queue= []
      let game= new OxoGame(queue)
      for(let i=0; i<6; i++){
        const currentPlayer=game.playerOnMove
        const queueLengthWas=queue.length
        game.playMove(i)
        expect(queue.length).toBe(queueLengthWas + 1)
        expect(queue[queue.length-1]).toEqual({game:game.name, player:currentPlayer, playedAt:i})
      }
      let lastMove=game.playerOnMove
      game.playMove(6)
      expect(queue.length).toBe(7)
      expect(queue[6]).toEqual({game:game.name, player:lastMove, playedAt:6})
  })
  test('but still ignores invalid moves', ()=>{
      const queue= []
      let game= new OxoGame(queue)
      for(let i=0; i<7; i++){
        const currentPlayer=game.playerOnMove
        const queueLengthWas=queue.length
        //
        game.playMove(i)
        game.playMove(i)
        //
        expect(queue.length).toBe(queueLengthWas + 1)
        expect(queue[queue.length-1]).toEqual({game:game.name, player:currentPlayer, playedAt:i})
      }
      game.playMove(0)
      expect(queue.length).toBe(7)
  })
})
