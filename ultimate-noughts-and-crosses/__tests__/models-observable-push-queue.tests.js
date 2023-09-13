import '@jest/globals'
import ObservablePushQueue from '../js/Observable-push-queue'

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
      expect(observed1[queue.length-1]).toEqual({method:'push', action:{i:i, j: new Date(2000 + i,i,i)}})
      expect(observed2.length).toBe(queueLengthWas + 1)
      expect(observed2[queue.length-1]).toEqual({method:'push', action:{i:i, j: new Date(2000 + i,i,i)}})
    }
})

test('Queue.pop() calls observers', ()=>{

    let observed1= []
    let observed2=[]
    const queue= new ObservablePushQueue()

    queue.addObserver('1', e=>observed1.push(e))
    queue.addObserver('2', e=>observed2.push(e))

    for(let i=0; i<6; i++){
      queue.push({i:i, j: new Date(2000 + i,i,i)})
    }

    for(let i=5; i>=0; i--){
      const expectedEvent={method:'pop', action:{i:i, j: new Date(2000 + i,i,i)}}
      const expectedAction = queue.pop()
      expect(expectedEvent.action).toEqual(expectedAction)

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
      queue.push({i:i, j: new Date(2000 + i,i,i)})
    }

    for(let i=0; i<6; i++){
      const expectedEvent={method:'shift', action:{i:i, j: new Date(2000 + i,i,i)}}
      const expectedAction = queue.shift()
      expect(expectedEvent.action).toEqual(expectedAction)

      expect(observed1.length).toBe(7 + i)
      expect(observed1[observed1.length-1]).toEqual(expectedEvent)

      expect(observed2.length).toBe(7 + i)
      expect(observed2[observed2.length-1]).toEqual(expectedEvent)
    }
})

describe('Re-entrant Queue.pushes process all pushes', ()=>{

  test("Given a push that triggers nested pushes.", ()=>{

    let observed= []
    let observed2=[]
    const maxTestNestedPushes= 10
    let nestedPushesMadeSoFar=0
    const queue= new ObservablePushQueue()

    queue.addObserver('1', e=>observed.push(e))
    queue.addObserver('2', e=>{
      observed2.push(e)
      if( nestedPushesMadeSoFar++ < maxTestNestedPushes){
        queue.push({from:"observer2", number:nestedPushesMadeSoFar})
      }
    })

    queue.push("kick")
    console.log("queue", queue)
    console.log("observed", observed)
    console.log("observed2", observed2)
    expect(observed.length).toBe(1 + maxTestNestedPushes)
    expect(observed2.length).toBe(1 + maxTestNestedPushes)
    expect(observed[maxTestNestedPushes].action).toEqual( {from:"observer2", number:maxTestNestedPushes} )

  })

  test("And the stack size doesn't grow. Given a push that triggers 1000 nested pushes.", ()=>{

    let observed= []
    let maxStackSize=0
    const maxTestNestedPushes= 1000
    let nestedPushesMadeSoFar=0
    const queue= new ObservablePushQueue()

    queue.addObserver('1', e=>observed.push(e))
    queue.addObserver('2', ()=>{
      if( nestedPushesMadeSoFar++ < maxTestNestedPushes){
        queue.push({from:"observer2", number:nestedPushesMadeSoFar})
      }
      const err= new Error().stack
      const lines= ( err.match(/\n/g) || []).length
      maxStackSize= Math.max(maxStackSize, lines)
    })

    queue.push("kick")
    console.log("Max stack size was", maxStackSize)
    expect( maxStackSize).toBeLessThan( 50 /* even though we pushed nested 100 events */)
  })

})
