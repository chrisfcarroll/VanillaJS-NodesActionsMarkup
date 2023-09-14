import OxoGame, {unplayedSquare} from '../js/Oxo-game'
import UltimateOxoGame, {gameNumberFromName} from '../js/Ultimate-oxo-game'
import {computerChooseMoveOnOxoGame, computerChooseMoveOnUltimateOxoGame} from '../js/computer-player'
import ObservablePushQueue from '../js/Observable-push-queue'

describe('Computer player', ()=>{

  test('Can make valid moves Given a game', ()=>{

    const moves=[]
    const name=new Date().toISOString()
    const game= new OxoGame(moves, name )

    for(let i= 1; i <= 8 ; i++){
      const player=game.playerOnMove
      const playAt= computerChooseMoveOnOxoGame(game)

      expect(game.boardModel[playAt]).toBe(unplayedSquare)

      game.playMove(playAt)

      expect(moves.length).toBe(i)
      expect(moves[i-1]).toEqual({game:name, player:player, playedAt:playAt})
    }
    console.log(moves)
  })

  test('Can make valid moves Given a metaGame', ()=>{

    const moves=new ObservablePushQueue()
    const game= new UltimateOxoGame(moves)

    const {board,square}= computerChooseMoveOnUltimateOxoGame(game)

    expect( game.games[board].boardModel[square]).toBe(unplayedSquare)

    game.games[board].playMove(square)

    expect(moves.length).toBe(1)
    expect(moves[0].playedAt).toBe(square)
    expect(gameNumberFromName( moves[0].game)).toBe(board)

  })

})
