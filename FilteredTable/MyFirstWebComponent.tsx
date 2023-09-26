class MyFirstWebComponent extends HTMLElement {
  connectedCallback() {
    this.replaceWith(<>
      <p>This text is emitted by {"<my-first-web-component>"} which is defined
        in MyFirstWebComponent.tsx as:</p>
      <pre>{`  class MyFirstWebComponent extends HTMLElement {
      connectedCallback() {
        this.replaceWith(<>
          <p>This text is from <my-first-web-component> which is defined
          in MyFirstWebComponent.tsx as:</p>
          <pre>...</pre>
        </>)
      }
    }
    customElements.define('my-first-web-component', MyFirstWebComponent)`}</pre>
    </>)
  }
}
customElements.define('my-first-web-component', MyFirstWebComponent)
