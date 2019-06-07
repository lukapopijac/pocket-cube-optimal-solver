const template = document.createElement('template');
template.innerHTML = require('./button.html');

export class Button extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this._button = this.shadowRoot.querySelector('button');
	}

	static get observedAttributes() {
		return ['primary', 'stretch'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		this._button.setAttribute(attrName, newVal);
	}
}

customElements.define('m-button', Button);
