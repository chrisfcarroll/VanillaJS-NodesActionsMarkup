# VanillaJS with Nodes-Actions-Markup

HTML + CSS + JavaScript is probably the most powerful and flexible user
interface framework *ever* created so it is unsurprising that people [sometimes
argue against the layering of some other framework on top of it](http://vanilla-js.com).
What, after all, can a another framework _add_ to what is already the most powerful framework you can ask for? Nothing really.

What might be achieved is to _simplify_. Html plus Css plus javascript is not
simple. React, Angular, Vue and others do, in the their own way, succeed in 
simplifying working with Html-Css-js, at the cost of adding another learning 
curve. But we cannot pretend that it possible to be expert in any of them 
without a good grip of the underlying technology.

I suggest an alternative approach. Instead of a framework on top of html+css+js
all we really need is a pattern, or a _way of working_. Nodes-Actions-Markup is a 
pattern for working with html+css+js in dynamic web pages. Although dynamic,
the real area of interest is _content-driven_ web pages. Most of the web is
content. If you are aiming to write a desktop-app-in-a-browser, then a framework
is a good choice. If you are aiming to present _content_ on the web, and then 
enrich it, the frameworks feel like a backward step: they start by removing
all your content.

Example: [ultimate-noughts-and-crosses game](./ultimate-noughts-and-crosses)

## Nodes-Actions-Markup

You can write effective program code against html in 3 steps:

1. Identify the **Nodes** in the page which code must access
2. Identify the **Actions** associated with those nodes
3. Optionally, be able to add and remove **Markup** from the page

### Nodes

Identify your nodes of interest in the obvious way. For instance for a noughts
and crosses game *(aka tic-tac-toe)*, you likely want to identify the entire game board
and also each of the nine squares:
```js
const gameboardNodeId = "gameboard"
const gameboardNode = ()=> document.getElementById(gameboardNodeId)

const gameSquaresSelector = "div[role=gridcell]"
const gameSquaresNodes = ()=> gameboardNode().querySelectorAll(gameSquaresSelector)
```

*( You might decide there is no need to use functions as I have done here, you can simply use constants:*
```js
const gameboardNodeId = "gameboard"
const gameboardNode = document.getElementById(gameboardNodeId)
```
*One trade-off is whether you can test those 2 lines of code in a command-line test runner. The `document` probably won't be set up when the module defining the `const` is loaded. The second trade-off is that dynamically-placed nodes may still need a function call to evaluate, so perhaps the developer experience is easier if you just make everything a function call. If performance is an issue, you can memo-ise).*

In a line-of-business application with form elements, the nodes you identify will be every element you wish to interact with programmatically, for instance:
```js
const signUpFormSelector ="[role=form].signup"
const signUpFormNode = () => document.querySelector(signUpFormSelector)
const areasOfInterestSelector = ".areas-of-interest input[type=radio]"
const areasOfInterestNodes = () => signUpFormNode.querySelectorAll(areasOfInterestSelector)
```

How you organise and encapsulate the nodes is your key design decision, but this decision is key whatever framework or not you use for your UI. For a singleton form I might do this:

```js
const signUpForm = {
	nodes: {
		form : signUpFormNode
		areasOfInterestNodes : areasOfInterestNodes,
	}
}
```
but for multiple instances of a UI element appearing on a single page, I would use a constructor function with some identifier as parameter:
```js
const allGameboardsNodeId = "all-gameboards"
const gameboardNode = (n)=> document.getElementById(allGameboardsNodeId).querySelector(`:nth-child(${n})`)
const gameSquaresNodes = (n)=> gameboardNode(n).querySelectorAll(gameSquaresSelector)

function NoughtAndCrossesBoard(boardNumber){
	this.nodes: {
		gameSquares : () => gameSquaresNodes(boardNumber)
	}
}
```
or if you prefer ES6 class notation over js constructor functions:
```js

class NoughtAndCrossesBoard {
	constructor(boardNumber){
		this.boardNumber=boardNumber
		this.nodes= {
			gameSquares : () => gameSquaresNodes(boardNumber)
		}
	}
}
```

### Actions

Actions typically depend on _Nodes_ which they are connected to and/or must know about; and on a _model_ which they may update. We'll discuss models more below, when we think about how Nodes-Actions-Markup relates to MVC.

Actions are of two kinds. Event listeners commonly need one-time wire-up and then they work for the lifetime of your page because the browser makes them work. For a singleton UI element with only event listeners, a method call during page load can handle all the wire-up.
```js

wireUpGameBoard(noughtsAndCrossesGameModel){
	const board= new NoughtAndCrossesBoard()
	for(let i=0; i < 9; i++ ){
		const node=board.nodes.gameSquares[i]
		node.addEventListener('click', function(e){
			const whoPlayed=noughtsAndCrossesGameModel.playAt(i)
			e.target.innerHTML = whoPlayed
		})
	}
}

```
A second kind of action is something that you might programmatically call after page load. This kind of action becomes more important as your UI grows to the point that you must construct it as multiple independent elements which may talk to each other, or if non-UI events can trigger UI changes. So this kind of action should be encapsulated together with its nodes:
```js
function NoughtAndCrossesBoard(boardNumber, noughtsAndCrossesGameModel){
	const gameSquares = () => gameSquaresNodes(boardNumber)
	this.nodes = {
		gameSquares: gameSquares
	}
	// This action can be called from an event listener attached to a 'New Game' button external to this board.
	this.clearBoard = function(){
		for(let square of gameSquares){
			square.innerHTML= unplayedSquareHTML
		}
	}
	// These actions are the one-time setup for event listeners
	for(let i=0; i < 9; i++ ){
		const node=gameSquares[i]
		node.addEventListener('click', function(e){
			const whoPlayed=noughtsAndCrossesGameModel.playAt(i)
			e.target.innerHTML = whoPlayed
		})
	}
}
const unplayedSquareHTML=' '
```
As in all software, as the project grows you must plan what actions each element will expose to other elements, and how they are coupled, and how they get references to each other. Javascript modules with their import & export commands work well for modularisation, encapsulation, and defining which modules depend on knowledge of other modules.

### Markup

If all your markup is static, you are done. You have Nodes, Actions and Markup working together. If some of your markup is dynamic, it must be placed in the page before Nodes and Actions can reference it.
```js
wireUpNineSimultaneousGamesOfNoughtAndCross(){
	const container= allGameboardsNode()
	const games= []
	const boards= []
	for(let i=0; i < 9; i++){
		insertGameBoardMarkup(i, container)
		games.push( new NoughtsAndCrossesGameModel() )
		board.push( new NoughtAndCrossesBoard(i, game[i]) )
	}
}
```
The code to insert markup can be done in a couple of ways. Backticks let you write markup in multiline strings in a function:
```js
function insertGameBoardMarkup(boardNumber, container){

  const templatedContent= `<section class="oxo-board-section">
      <div role="grid" class="oxo-board" aria-label="Board 0" id="board0">
        <div role="gridcell" id="board0-cell-1" aria-labelledby="board0 board0-cell-1">
          <label>top left</label> </div>
        <div role="gridcell" id="board0-cell-2"  aria-labelledby="board0 board0-cell-2">
          <label>top middle</label> </div>
        <div role="gridcell" id="board0-cell-3"  aria-labelledby="board0 board0-cell-3">
          <label>top right</label> </div>
        <div role="gridcell" id="board0-cell-4" aria-labelledby="board0 board0-cell-4">
          <label>middle left</label> </div>
        <div role="gridcell" id="board0-cell-5"  aria-labelledby="board0 board0-cell-5">
          <label>middle square</label> </div>
        <div role="gridcell" id="board0-cell-6"  aria-labelledby="board0 board0-cell-6">
          <label>middle right</label> </div>
        <div role="gridcell" id="board0-cell-7" aria-labelledby="board0 board0-cell-7">
          <label>bottom left</label> </div>
        <div role="gridcell" id="board0-cell-8"  aria-labelledby="board0 board0-cell-8">
          <label>bottom middle</label> </div>
        <div role="gridcell" id="board0-cell-9"  aria-labelledby="board0 board0-cell-9">
          <label>bottom right</label> </div>
      </div>
    </section>`
          .replaceAll('board0','board' + boardNumber)
          .replaceAll('Board 0','Board ' + boardNumber)
          .replaceAll('board 0','cells ' + boardNumber)

  container.insertAdjacentHTML("beforeend", `<section class="oxo-board-section">${templatedContent}</section>`)
  return container
}
```
Or you can store template markup in html template elements. With html templates you still have to do your own injection of instance-specific markup:
```js
const gameboardTemplateId="gameboard-template"

export function insertGameBoardMarkup(boardNumber, container){
  const template=document.getElementById(gameboardTemplateId)

  const templatedContent= template.content.firstElementChild.innerHTML
          .replaceAll('board0','board' + boardNumber)
          .replaceAll('Board 0','Board ' + boardNumber)
          .replaceAll('board 0','cells ' + boardNumber)

  container.insertAdjacentHTML("beforeend", `<section class="oxo-board-section">${templatedContent}</section>`)
  return container
}
```
Or, you can get to grips with Web Components. That requires a little more learning to get off the ground though.

### Summary

You can work effectively with html+javascript by organising your code as _Nodes_, which identify the key Html nodes of interest to your code, and _Actions_, which know about Nodes and also know about the *models* that your web page exposes to the user.

## Nodes-Action-Markup vs Model View Controller

To understand model view controller and how it is a correct way to do a user interface you must understand it at two levels. At the top level, you must understand that the goal of MVC is to support the user-illusion that as the user uses your program they are dealing, not with pixels or HTML or such like, but with “real things” that they can think about and understand. For instance a signup form, or a table top game.

So the _model_ is a key element for any interesting application. The view and the controller are how the user interacts with the model. The view and controller should be designed to sustain the user-illusion that the user “reaches through” the interface to manipulate and view the model.

Views have the responsibility of representing the model to the user, usually on-screen, in such a way that the user feels they are seeing the very thing itself. For instance, when a user sees an html signup form, they do not think “I can see the html elements on screen, but where's the form?” They think that the html elements in their browser _is_ the form. And so they fill it in. (As developers, we are also tricked by this illusion bceause the HTML standard uses 'form' for the name of an HTML element! HTML sustains the illusion so successfully that you may have to pause for a moment to realise that an HTML form element is not what a human being thinks a form is). Similarly if the user see a grid of nine squares, they think that _is_ the game.

The controller's responsibility depends on what version of MVC you are using. In some versions, the view is also responsible for letting the user _update_ the model, as well as seeing the model. This pattern works well if you implement two-way data-binding: the view is bound to the model and changing one changes the other. In other versions, the controller is responsible for updating the model, and the view only reads it. This works well with a one-way dataflow approach.

So Nodes-Actions-Markup still relies on having a _model_ to do anything meaningful. A noughts-and-crosses game should have a game model to track game state: who's turn it is, whether the game has been won, what squares have been played. An html _form_ is a special case. With forms, the browser itself knows about and maintains the model for you, so there is no need to add any kind of model class in code to represent it.

So Nodes-Actions-Markup helps you to build views and optionally controllers. The View that the user sees is the visible markup. The _Nodes_ part of Nodes-Actions-Markup lets you read and write that view in code. The _Actions_ part lets the user update the model, and lets your code keep the view in sync with the model.

What about the Observer pattern? Implementing the observer pattern in Javascript is not hard, but it's worth knowing that it is not essential to the goal of MVC. Rather, the observer pattern is of most use when you have multiple views on screen simultaneously, in which registering the views as observers of the model is a good way to guarantee they stay in sync.

### Summary

In retrospect, one of the things that frameworks over HTML each gave us, is a way to *organise* how we work with HTML. You don't need a framework to organise how you work; just having a standard pattern will do.

Refs: https://www.cafe-encounter.net/p3501/nodes-actions-markup-use-vanillajs-in-the-browser
