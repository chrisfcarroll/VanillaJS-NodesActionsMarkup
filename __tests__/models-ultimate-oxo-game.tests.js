import '@jest/globals'
import '@testing-library/jest-dom'
import OxoGame, {unplayedSquare} from '../js/Oxo-game'
import ObservablePushQueue from '../js/Observable-push-queue'
import UltimateOxoGame from '../js/Ultimate-oxo-game'

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
  const winGame1ForO = [
    {game: 1, player: "x", playedAt: 1},
    {game: 1, player: "O", playedAt: 2},
    {game: 2, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 5},
    {game: 5, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 8}
  ]
  for(let move of winGame1ForO){
    lastPlayer=metaGame.playerOnMove
    metaGame.games[move.game].playMove(move.playedAt)
  }
  expect( metaGame.games[1].winLine).toEqual([2,5,8])
  expect( metaGame.games[1].winner ).toBe(lastPlayer)

  for(let i=2; i <= 9 ; i++){
    expect(metaGame.games[i].winLine).toBeUndefined()
  }
})

test('UltimateOxoGame updates the metagame when a game is finished', ()=>{
    const metaGame=new UltimateOxoGame()
    let lastPlayer

  const winGame1ForO = [
    {game: 1, player: "x", playedAt: 1},
    {game: 1, player: "O", playedAt: 2},
    {game: 2, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 5},
    {game: 5, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 8}
  ]
  for(let move of winGame1ForO){
    lastPlayer=metaGame.playerOnMove
    metaGame.games[move.game].playMove(move.playedAt)
  }
  expect( metaGame.games[1].winLine).toEqual([2,5,8])

  expect(metaGame.metaGame.boardModel.slice(1,10)).toEqual(
      [lastPlayer, unplayedSquare,unplayedSquare,
                unplayedSquare,unplayedSquare,unplayedSquare,
                unplayedSquare,unplayedSquare,unplayedSquare,])
})

test('UltimateOxoGame overrides playerOnMove for the nine child games ', ()=>{
  const metaGame= new UltimateOxoGame()
  const games= metaGame.games
  games[1].playMove(1);
  expect(games[1].playerOnMove).toBe('O')

  for(let i=2; i <=9 ; i++){
    expect(games[i].playerOnMove).toBe('O')
  }

})

test('UltimateOxoGame restricts which board can next be played on', ()=>{
  const metaGame= new UltimateOxoGame()
  const games= metaGame.games
  expect(metaGame.nextBoard).toBe(0)
  games[1].playMove(1);
  expect(metaGame.nextBoard).toBe(1)

})

const winForOinGame1 = [
    {game: 1, player: "x", playedAt: 1},
    {game: 1, player: "O", playedAt: 2},
    {game: 2, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 5},
    {game: 5, player: "X", playedAt: 1},
    {game: 1, player: "O", playedAt: 8}
  ]

test('UltimateOxoGame.newGame() starts new games', ()=> {
  const metaGame= new UltimateOxoGame()

  givenAWinForOinBoard1()
  givenSomeMoreMoves()
  metaGame.newGame()

  for(let square of metaGame.metaGame.boardModel){
      expect(square).toBe(unplayedSquare)
  }
  for(let game of metaGame.games.filter(g=>g))for(let square of game.boardModel.filter(b=>b)){
    expect(square).toBe(unplayedSquare)
  }

  function givenAWinForOinBoard1() {
    for (let move of winForOinGame1) {
      metaGame.games[move.game].playMove(move.playedAt)
    }
    expect(metaGame.metaGame.boardModel[1]).toBe('O')
  }
  function givenSomeMoreMoves() {
    for (let i = 2; i <= 9; i++) {
      metaGame.games[metaGame.nextBoard].playMove(i)
    }
  }
})
