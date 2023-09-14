import OxoGame from './Oxo-game.js'
import ObservablePushQueue from './Observable-push-queue.js'

export function gameNumberFromName(name){
  let gameNumberMatch= tryGetGameNumberFromName(name)
  if(!gameNumberMatch){
    console.error(`Expected game number in name ${game.name} to be between 1 and 9`)
  }
  return gameNumberMatch
}
export function tryGetGameNumberFromName(name){
  let gameNumberMatch= name.match(/\d/)
  if(!gameNumberMatch || gameNumberMatch[0] < '1' || gameNumberMatch[0] > '9'){
    return 0
  }
  return parseInt(gameNumberMatch[0])
}

function UltimateOxoGame(moveQueue,name){
  this.moveQueue= moveQueue || new ObservablePushQueue()
  if(moveQueue && (!moveQueue.push || !moveQueue.addObserver)){throw new Error("queue doesn't have push/shift/addObserver functions")}
  this.name = name || "Metagame started at " + new Date().toTimeString()
  this.oldGames=[]
  this.playerOnMove='X'
  this.nextBoard=0
  const that=this;

  this.newGame= function(){
    that.games=new Array(10)
    for(let i=1; i<=9; i++){
      that.games[i]= new OxoGame(that.moveQueue,"Game "+i, that)
    }
    that.metaGame= (that.metaGame)
      ? new OxoGame(that.metaGame.moveQueue,"metaGame")
      : new OxoGame([],"metaGame")
    let lastGame=[]
    for(let i=0; that.moveQueue.length>0 || i> 9999; i++){
      lastGame.push(that.moveQueue.shift())
    }
    that.oldGames.push(lastGame)
    that.playerOnMove='X'
    that.nextBoard=0
  }

  this.observeMove= function(event){
    if(event.method !== 'push'){
      console.info('ignoring',event.method,event.action)
      return
    }
    console.info("Metagame heard",event.method, event.action)
    updateMetaGame()
    overrideChildGamesPlayerOnMove()

    function updateMetaGame() {
      let gameNumber = gameNumberFromName(event.action.game)
      let game = that.games[gameNumber]
      if (!game) {
        console.error("game " + event.action.game + " isn't in games list");
        debugger
      }
      if (game.winLine) {
        console.log(`${game.name} was won by ${game.winner}`)
        that.metaGame.playerOnMove = game.winner
        that.metaGame.playMove(gameNumber)
      }
      that.playerOnMove = (that.playerOnMove === 'X' ? 'O' : 'X')
      that.nextBoard= (that.games[event.action.playedAt].winLine ? 0 : event.action.playedAt)
    }
    function overrideChildGamesPlayerOnMove() {
      for (let game of that.games.filter(g=>g)) {
        game.playerOnMove = that.playerOnMove
      }
    }
  }

  this.moveQueue.addObserver(this.name, this.observeMove)
  this.newGame()
}

export default UltimateOxoGame
