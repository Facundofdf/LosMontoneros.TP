export function mountHtml(root, htmlString){
  root.innerHTML = htmlString;
}
export function qs(selector, el=document) { return el.querySelector(selector); }
export function on(el, ev, fn){ el.addEventListener(ev, fn); }
