import OxoGame from './oxo-game.js'

export function gameNumberFromName(name){
  let gameNumberMatch= name.match(/\d/)
  if(!gameNumberMatch || gameNumberMatch[0] < 1 || gameNumberMatch[0] > 9){
    console.error(`Expected game number in name ${game.name} to be between 1 and 9`)
  }
  return gameNumberMatch[0]
}

function UltimateOxoGame(queue,oxoGames){
  if(!queue || !queue.push || !queue.addObserver){throw new Error("queue doesn't have push/shift/addObserver functions")}
  if(!oxoGames || typeof oxoGames[Symbol.iterator] !== 'function'){throw new Error("oxoGames is not iterable")}
  const that=this;
  this.name = this.name || "Metagame started at " + new Date().toTimeString()
  this.queue=queue
  this.games=new Map()
  this.shadowQueue=[]
  for(let i=0; i<9; i++){
    let game= oxoGames[i]
    if(typeof game === 'string'){
      game= new OxoGame(this.shadowQueue,game)
      game.isShadowOf=this.name
    }
    this.games.set(game.name,game)
  }
  if(this.games.size!==9){throw new Error(`you passed ${this.games.size} oxoGames instead of 9`)}

  for (let game of this.games.values()) {
    game.newGame()
  }

  this.metaGame=new OxoGame([],"metaGame")

  this.observeMove= function(event){
    console.info(event)
    let game= that.games.get(event.value.game)
    if(game.isShadowOf && game.isShadowOf===that.name){
      game.playMove(event.value.playedAt)
    }
    if(game.winLine){
      console.log(`${game.name} won by ${game.winner}`)
      let gameNumber = gameNumberFromName(game.name)
      that.metaGame.playerOnMove= game.winner
      that.metaGame.playMove(gameNumber - 1 /*The game name is 1-based, the array is 0-based*/)
    }
  }
  this.queue.addObserver(this.name, this.observeMove)
}

export default UltimateOxoGame
