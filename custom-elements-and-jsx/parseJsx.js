// Mostly from https://dev.to/devsmitra/how-to-create-the-app-using-jsx-without-react-k08
// except that babel expects children as a third parameter not as part of props.
//

const add = (parent, child) => {
  parent.appendChild(child?.nodeType ? child : document.createTextNode(child));
};

const jsxAppendChild = (parent, child) => {
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => jsxAppendChild(parent, nestedChild));
  } else {
    add(parent, child);
  }
};

const parseJsxToHtmlElementNodes = (tag, attrs={}, ...children) => {
  if (typeof tag === "function") return tag(attrs, children);
  const element = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([name, value]) => {
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substring(2), value);
    } else {
      element.setAttribute(name, value);
    }
  });
  jsxAppendChild(element, children);
  return element;
};

const React = { createElement : parseJsxToHtmlElementNodes }
