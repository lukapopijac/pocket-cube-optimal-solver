const template = document.createElement('template');
template.innerHTML = require('./button.html');

export class Button extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
}

customElements.define('m-button', Button);
