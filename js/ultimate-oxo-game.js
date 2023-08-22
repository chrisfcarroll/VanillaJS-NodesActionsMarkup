import OxoGame from './oxo-game.js'

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
    // noinspection BadExpressionStatementJS
    false && console.info('Metagame has game',game.name, game)
  }
  if(this.games.size!==9){throw new Error(`you passed ${this.games.size} oxoGames instead of 9`)}

  for (let game of this.games.values()) {
    game.newGame()
  }
  this.observeMove= function(event){
    console.info(event)
    let game= that.games.get(event.value.game)
    if(game.isShadowOf && game.isShadowOf===that.name){
      game.playMove(event.value.playedAt)
    }
    if(game.winLine){
      console.log(`${game.name} won by ${game.winner}`)
    }
  }
  this.queue.addObserver(this.name, this.observeMove)
}



export default UltimateOxoGame
