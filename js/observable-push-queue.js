function ObservablePushQueue(){
  this.array=[]
  this.observers= new Map()

  this.addObserver= function(name,observer){
    if(typeof observer !=='function')throw new Error(observer + ' is not a function');
    if(this.observers.has(name))throw new Error(name + ' is already registered')
    this.observers.set(name,observer)
  }
  this.broadcast = function(action,value) {
    for (let key of this.observers.keys()) {
      let observer=this.observers.get(key)
      try{ observer({action: action, value: value})}
      catch(e){console.warn('casting to observer',key,e)}
    }
  }

  this.push=function(x){
    this.array.push(x)
    this[this.array.length-1]=x
    this.broadcast('push', x)
  }

  this.pop = function(){
    if(this.array.length){delete this[this.array.length]}
    const popped = this.array.pop()
    this.broadcast('pop',popped)
    return popped
  }
  this.shift = function(){
    if(this.array.length){delete this[this.array.length]}
    const shifted = this.array.shift()
    this.broadcast('shift',shifted)
    return shifted
  }
}
ObservablePushQueue.prototype ={
  get length() {return this.array.length}
}

export default ObservablePushQueue
