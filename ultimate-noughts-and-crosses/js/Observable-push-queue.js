function ObservablePushQueue(){
  const that=this;
  this.array=[]
  this.observers= new Map()
  this.pending=undefined

  this.addObserver= function(name,observer){
    if(typeof observer !=='function')throw new Error(observer + ' is not a function');
    if(that.observers.has(name))throw new Error(name + ' is already registered')
    that.observers.set(name,observer)
  }
  this.broadcast = function(method,action) {
    const isaReentrantPush= !!that.pending
    that.pending= that.pending || []
    that.pending.push({method:method,action:action})
    if(isaReentrantPush)return;
    //
    while(that.pending.length){
      const event= that.pending.shift()
      sendToObservers.call(this,event.method,event.action)
    }
    that.pending=undefined

    function sendToObservers(method, action) {
      for (let key of that.observers.keys()) {
        let observer = that.observers.get(key)
        try {
          observer({method: method, action: action})
        } catch (e) {
          console.warn('Error in call to observer', key, e)
        }
      }
    }
  }

  this.push=function(x){
    that.array.push(x)
    this[that.array.length-1]=x
    that.broadcast('push', x)
  }

  this.pop = function(){
    if(that.array.length){delete this[that.array.length]}
    const popped = that.array.pop()
    that.broadcast('pop',popped)
    return popped
  }
  this.shift = function(){
    if(that.array.length){delete this[that.array.length]}
    const shifted = that.array.shift()
    that.broadcast('shift',shifted)
    return shifted
  }
}
ObservablePushQueue.prototype ={
  get length() {return this.array.length}
}

export default ObservablePushQueue
