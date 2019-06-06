const template = document.createElement('template');
template.innerHTML = require('./color-pick.html');

export class ColorPick extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this._el = this.shadowRoot.querySelector('div');
	}

	static get observedAttributes() {
		return ['val', 'selected'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName == 'val') {
			this._el.setAttribute('val', newVal);
		}
		if(attrName == 'selected') {
			if(newVal != null) this._el.setAttribute('selected', true);
			else this._el.removeAttribute('selected');
		}
	}
}

customElements.define('m-colorpick', ColorPick);
