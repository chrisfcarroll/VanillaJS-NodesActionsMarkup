import OxoGame from './oxo-game.js'
import ObservablePushQueue from './observable-push-queue.js'

export function gameNumberFromName(name){
  let gameNumberMatch= name.match(/\d/)
  if(!gameNumberMatch || gameNumberMatch[0] < 1 || gameNumberMatch[0] > 9){
    console.error(`Expected game number in name ${game.name} to be between 1 and 9`)
  }
  return gameNumberMatch[0]
}

function UltimateOxoGame(queue,name){
  this.queue= queue || new ObservablePushQueue()
  if(queue && (!queue.push || !queue.addObserver)){throw new Error("queue doesn't have push/shift/addObserver functions")}
  this.name = name || "Metagame started at " + new Date().toTimeString()
  this.oldGames=[]
  const that=this;

  this.newGame= function(){
    that.games=new Array(10)
    for(let i=1; i<=9; i++){
      that.games[i]= new OxoGame(that.queue,"Game "+i)
    }
    that.metaGame= (that.metaGame)
      ? new OxoGame(that.metaGame.moveQueue,"metaGame")
      : new OxoGame([],"metaGame")
    let lastGame=[]
    for(let i=0; that.queue.length>0 || i> 9999; i++){
      lastGame.push(that.queue.shift())
    }
    that.oldGames.push(lastGame)
  }

  this.observeMove= function(event){
    if(event.action !== 'push'){
      console.info('ignoring',event.action,event.value)
      return
    }
    console.info(event.action,event.value)
    let gameNumber=gameNumberFromName(event.value.game)
    let game= that.games[gameNumber]
    if(!game){console.error("game " +event.value.game + " isn't in games list") ; debugger}
    if(game.winLine){
      console.log(`${game.name} was won by ${game.winner}`)
      that.metaGame.playerOnMove= game.winner
      that.metaGame.playMove(gameNumber)
    }
  }

  this.queue.addObserver(this.name, this.observeMove)
  this.newGame()
}

export default UltimateOxoGame
