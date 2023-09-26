# VanillaJS with Simple WebComponents and Jsx

#### Can Easily Do
- Define stateless WebComponents straightforwardly as Classes with a
  <code>connectedCallback</code> method using <code>this.replaceWith(...)</code>
  or <code>this.innerHTML=...</code>
- Define stateful WebComponents somewhat straightforwardly as classes,
  with state stored in fields
- Use JSX and/or TypeScript if you like, by adding a script tag for
  <a href="https://babeljs.io/docs/babel-standalone">babel standalone</a>
  to your document
- Use promises inside WebComponents to fetch data asynchronously

#### Can't Easily Do
- autofocus inside a custom element may have to be implemented manually in code. Probably there are other similar gotchas.</li>


#### Sources
- https://blog.r0b.io/post/using-jsx-without-react/
- https://dev.to/devsmitra/how-to-create-the-app-using-jsx-without-react-k08
- https://github.com/kognise/water.css
