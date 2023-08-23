import '@jest/globals'
import '@testing-library/jest-dom'
import OxoGame, {unplayedSquare} from '../../js/oxo-game'
import ObservablePushQueue from '../../js/observable-push-queue'
import UltimateOxoGame from '../../js/ultimate-oxo-game'

test('UltimateOxoGame reads the game queue', ()=>{
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

test('UltimateOxoGame knows when a game is finished', ()=>{
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

test('UltimateOxoGame updates the metagame when a game is finished', ()=>{
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

    expect(metaGame.metaGame.boardModel).toEqual(
        ['X', unplayedSquare,unplayedSquare,
                  unplayedSquare,unplayedSquare,unplayedSquare,
                  unplayedSquare,unplayedSquare,unplayedSquare,])
})
