import {fireEvent, screen} from '@testing-library/dom'
import '@jest/globals'
import '@testing-library/jest-dom'
import {promises as fs} from 'fs'

test('jest runs', ()=>{
  expect(true).toBeTruthy()
})

test('testing-library and jest-dom runs', ()=>{

  document.body.innerHTML ="<button>Press</button>";
  const button=screen.getByText('Press')
  expect(button).toBeVisible()
})

test('can load index.html', async ()=> {

  const indexRaw= (await fs.readFile('index.html')).toString()
  //const indexRaw= (await fetch('../index.html')).text()
  const index= new DOMParser().parseFromString(indexRaw,"text/html")
  document.body.innerHTML=index.body.innerHTML

  expect(document.body).toBeVisible()
})
