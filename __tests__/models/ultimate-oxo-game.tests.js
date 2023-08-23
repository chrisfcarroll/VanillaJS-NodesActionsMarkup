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

  const metaGame=new UltimateOxoGame()
  let lastPlayer;
  for(let i=1; i<=7; i++){
      lastPlayer=metaGame.games[1].playerOnMove
      metaGame.games[1].playMove(i)
    }
  expect( metaGame.games[1].winLine).toEqual([3,5,7])
  expect( metaGame.games[1].winner ).toBe(lastPlayer)

  for(let i=2; i <= 9 ; i++){
    expect(metaGame.games[i].winLine).toBeUndefined()
  }
})

test('UltimateOxoGame updates the metagame when a game is finished', ()=>{
    const metaGame=new UltimateOxoGame()
    const games=metaGame.games
    let lastPlayer

    for(let i=1; i <= 7; i++){
      lastPlayer=games[1].playerOnMove
      games[1].playMove(i)
    }
    expect(games[1].winLine).toEqual([3,5,7])

    expect(metaGame.metaGame.boardModel.slice(1,10)).toEqual(
        ['X', unplayedSquare,unplayedSquare,
                  unplayedSquare,unplayedSquare,unplayedSquare,
                  unplayedSquare,unplayedSquare,unplayedSquare,])
})
