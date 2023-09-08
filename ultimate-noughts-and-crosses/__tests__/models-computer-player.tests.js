import OxoGame from '../js/Oxo-game'
import UltimateOxoGame, {gameNumberFromName} from '../js/Ultimate-oxo-game'
import {computerPlayMoveOnOxoGame, computerPlayMoveOnUltimateOxoGame} from '../js/computer-player'
import ObservablePushQueue from '../js/Observable-push-queue'

describe('Computer player', ()=>{

  test('Can make valid moves Given a game', ()=>{

    const moves=[]
    const name=new Date().toISOString()
    const game= new OxoGame(moves, name )

    for(let i= 1; i <= 8 ; i++){
      const player=game.playerOnMove
      const playedAt= computerPlayMoveOnOxoGame(game)

      expect(moves.length).toBe(i)
      expect(moves[i-1]).toEqual({game:name, player:player, playedAt:playedAt})
    }
    console.log(moves)
  })

  test('Can make valid moves Given a metaGame', ()=>{

    const moves=new ObservablePushQueue()
    const game= new UltimateOxoGame(moves)

    const {board,playedAt}= computerPlayMoveOnUltimateOxoGame(game)

    expect(moves.length).toBe(1)
    expect(moves[0].playedAt).toBe(playedAt)
    expect(gameNumberFromName( moves[0].game)).toBe(board)

  })

})
