import '@jest/globals'
import '@testing-library/jest-dom'
import OxoGame from '../js/oxo-game'
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

test('meta game reads the game queue', ()=>{
    let queue = new ObservablePushQueue()
    let games=[]
    for(let i=0; i<9; i++){games.push(new OxoGame(queue,"Game " + (i+1)))}
    let metaGame=new UltimateOxoGame(queue,games)

    for(let i=1; i<=8; i++){
      const currentPlayer=games[i-1].playerOnMove
      const queueLengthWas=queue.length
      games[i-1].playMove(i)
      expect(metaGame.queue.length).toBe(queueLengthWas + 1)
      expect(metaGame.queue[metaGame.queue.length-1]).toEqual({game:games[i-1].name, player:currentPlayer, playedAt:i})
    }
})

test('meta game knows when a game is finished', ()=>{
    let queue = new ObservablePushQueue()
    let games=[]
    for(let i=0; i<9; i++){games.push(new OxoGame(queue,"Game " + (i+1)))}
    let metaGame=new UltimateOxoGame(queue,games)

    for(let i=0; i<7; i++){
      const currentPlayer=games[0].playerOnMove
      const queueLengthWas=queue.length
      games[0].playMove(i)
    }
    expect(games[0].winLine).toEqual([2,4,6])

  expect(metaGame.games.get('Game 1').winLine).toEqual([2,4,6])
  for(let i=2; i <= 9 ; i++){
    expect(metaGame.games.get('Game ' + 2).winLine).toBeUndefined()
  }

})
