# VanillaJS with Nodes-Actions-Markup

Html plus Css plus javascript is probably the most powerful and flexible user 
interface framework ever created so it is unsurprising that people [sometimes 
argue against the layering of some other framework on top of it](http://vanilla-js.com). 
What, after all, can a another framework _add_ to what is already the most powerful 
framework you can ask for? Nothing really.

What might be achieved is to _simplify_. Html plus Css plus javascript is not
simple. React, angular, Vue and others do, in the their own way, succeed in 
simplifying working with Html-Css-js, at the cost of adding another learning 
curve. But we cannot pretend that it possible to be expert in any of them 
without a good grip of the underlying technology.

I suggest an alternative approach. Instead of a framework on top of html+css+js
all we need is just a pattern, or a way of working. Nodes-Actions-Markup is a 
pattern for working with html+css+js in dynamic web pages. Although dynamic,
the real area of interest is _content-driven_ web pages. Most of the web is
content. If you are aiming to write a desktop-app-in-a-browser, then a framework
is a good choice. If you are aiming to present _content_ on the web, and then 
enrich it, the frameworks feel like a backward step: they start by removing
all your content.

## Nodes-Actions-Markup

You can write effective program code against html in 3 steps

1. Identify the **nodes** in the page which code must access
2. Identify the **actions** associated with those nodes
3. Optionally, be able to add and remove **markup** from the page

### Nodes

Identify your nodes of interest in the obvious way. For instance for a noughts
and cross (tic-tac-toe) game, you likely want to identify the entire game board
and also each of the nine squares:
```js
const gameboardNodeId = "gameboard"
const gameboardNode = ()=> document.getElementById(gameboardNodeId)

const gameSquaresSelector = "div[role=gridcell]"
const gameSquaresNodes = ()=> gameboardNode().querySelectorAll(gameSquaresSelector)
```

( You might notice there is no need to use functions as I have done here, you could simply use constants:
```js
const gameboardNodeId = "gameboard"
const gameboardNode = document.getElementById(gameboardNodeId)
```
The first trade-off here is that you can't test those 2 lines of code in a command-line test runner because the `document` probably won't be setup when the module defining the `const` is loaded. The second trade-off is that dynamically placed nodes may still need a function call to evaluate, so perhaps the developer experience is easier if you just make everything a function call. If performance is an issue, you can memo-ise).


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
but for multiple instances of something it would be:

...WIP ...
