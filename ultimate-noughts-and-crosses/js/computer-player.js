import {unplayedSquare} from './Oxo-game.js'
import {tryGetGameNumberFromName} from './Ultimate-oxo-game'

const wins = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ]

export function computerPlayMoveOnOxoGame(game){

  const me= game.playerOnMove

  const playables= wins
          .map(line => {
            const lineState={me:0, them:0, open:0, canPlayAt:0}
            line.map(cell=> {
              switch(game.boardModel[cell]){
                case me: lineState.me+=1; break;
                case unplayedSquare:
                  lineState.open+=1;
                  lineState.canPlayAt= lineState.canPlayAt || cell
                  break;
                default: lineState.them += 1;
              }
            })
            return lineState
          })
          .filter(lineState=> lineState.canPlayAt)

  playables.sort( (a,b) => a.open - b.open )
  //console.info(playables)

  game.playMove( playables[0].canPlayAt )
  return playables[0].canPlayAt
}

export function computerPlayMoveOnUltimateOxoGame(metaGame){

  const boardToPlay= (metaGame.nextBoard===0) ? chooseABoard() : metaGame.nextBoard

  if(boardToPlay===0) return {board:0, cell:0}
  return {
    board: boardToPlay,
    playedAt: computerPlayMoveOnOxoGame(metaGame.games[boardToPlay])
  }

  function chooseABoard(){
    if(metaGame.nextBoard !== 0)return metaGame.nextBoard
    ;
    const playables= metaGame.games.filter(g => ! g.winLine)
    return Math.ceil(Math.random() * playables.length)
  }
}

export function registerComputerPlayerToObserveMetaGameMoveQueueListenerToPlay(metaGame, gameStewardIsHumanOrComputer) {
    metaGame.moveQueue.addObserver("ComputerPlayer", function(event){
    if(event.method !== 'push')return;
    //
    const {game, player}= event.action
    if(!tryGetGameNumberFromName(game))return;
    //
    const nextPlayer= player==='O' ? 'X' : 'O';
    if(gameStewardIsHumanOrComputer(nextPlayer)==='computer'){
      computerPlayMoveOnUltimateOxoGame(metaGame)
    }
  })
}
