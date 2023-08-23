import '@jest/globals'
import ObservablePushQueue from '../../js/observable-push-queue'

test('Queue.push() keeps pushed elements and sets length', ()=>{
    const queue= new ObservablePushQueue()
    for(let i=0; i<6; i++){
      const queueLengthWas=queue.length
      queue.push({i:i, j: new Date(2000 + i,i,i)})
      expect(queue.length).toBe(queueLengthWas + 1)
      expect(queue[queue.length-1]).toEqual({i:i, j: new Date(2000 + i,i,i)})
    }
})

test('Queue.pop() gets pushed elements and sets length', ()=>{
    //
    const queue= new ObservablePushQueue()
    for(let i=0; i<12; i++){
      queue.push({i:i, j: new Date(2000 + i,i,i)})
    }

    for(let i=11; i>=0; i--){
      //
      const expected={i:i, j: new Date(2000 + i,i,i)}
      const actual= queue.pop()
      //
      expect(actual).toEqual(expected)
      expect(queue.length).toBe(i)
    }
})

test('Queue.shift() gets pushed elements and sets length', ()=>{
    //
    const queue= new ObservablePushQueue()
    for(let i=0; i<12; i++){
      queue.push({i:i, j: new Date(2000 + i,i,i)})
    }

    for(let i=0; i<12; i++){
      //
      const expected={i:i, j: new Date(2000 + i,i,i)}
      const actual= queue.shift()
      //
      expect(actual).toEqual(expected)
      expect(queue.length).toBe(11-i)
    }
})

test('Queue.push() calls observers', ()=>{

    let observed1= []
    let observed2=[]
    const queue= new ObservablePushQueue()

    queue.addObserver('1', e=>observed1.push(e))
    queue.addObserver('2', e=>observed2.push(e))

    for(let i=0; i<6; i++){
      const queueLengthWas=queue.length
      queue.push({i:i, j: new Date(2000 + i,i,i)})

      expect(observed1.length).toBe(queueLengthWas + 1)
      expect(observed1[queue.length-1]).toEqual({action:'push', value:{i:i, j: new Date(2000 + i,i,i)}})
      expect(observed2.length).toBe(queueLengthWas + 1)
      expect(observed2[queue.length-1]).toEqual({action:'push', value:{i:i, j: new Date(2000 + i,i,i)}})
    }
})

test('Queue.pop() calls observers', ()=>{

    let observed1= []
    let observed2=[]
    const queue= new ObservablePushQueue()

    queue.addObserver('1', e=>observed1.push(e))
    queue.addObserver('2', e=>observed2.push(e))

    for(let i=0; i<6; i++){
      const queueLengthWas=queue.length
      queue.push({i:i, j: new Date(2000 + i,i,i)})
    }

    for(let i=5; i>=0; i--){
      const expectedEvent={action:'pop', value:{i:i, j: new Date(2000 + i,i,i)}}
      const expectedValue = queue.pop()
      expect(expectedEvent.value).toEqual(expectedValue)

      expect(observed1.length).toBe(12 - i)
      expect(observed1[observed1.length-1]).toEqual(expectedEvent)

      expect(observed2.length).toBe(12 - i)
      expect(observed2[observed2.length-1]).toEqual(expectedEvent)
    }
})

test('Queue.shift() calls observers', ()=>{

    let observed1= []
    let observed2=[]
    const queue= new ObservablePushQueue()

    queue.addObserver('1', e=>observed1.push(e))
    queue.addObserver('2', e=>observed2.push(e))

    for(let i=0; i<6; i++){
      const queueLengthWas=queue.length
      queue.push({i:i, j: new Date(2000 + i,i,i)})
    }

    for(let i=0; i<6; i++){
      const expectedEvent={action:'shift', value:{i:i, j: new Date(2000 + i,i,i)}}
      const expectedValue = queue.shift()
      expect(expectedEvent.value).toEqual(expectedValue)

      expect(observed1.length).toBe(7 + i)
      expect(observed1[observed1.length-1]).toEqual(expectedEvent)

      expect(observed2.length).toBe(7 + i)
      expect(observed2[observed2.length-1]).toEqual(expectedEvent)
    }
})
