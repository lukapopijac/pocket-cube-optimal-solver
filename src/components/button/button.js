import t from './button.html';

const template = document.createElement('template');
template.innerHTML = t;

export class Button extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this._button = this.shadowRoot.querySelector('button');
	}

	static get observedAttributes() {
		return ['primary'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName == 'primary') {
			this._button.setAttribute('primary', newVal);
		}
	}
}

customElements.define('m-button', Button);
