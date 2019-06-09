const template = document.createElement('template');
template.innerHTML = require('./color-pick.html');

export class ColorPick extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
}

customElements.define('m-colorpick', ColorPick);
