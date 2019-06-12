import '../button/button.js';
import '../color-pick/color-pick.js';

const template = document.createElement('template');
template.innerHTML = require('./setup-controls.html');

export class SetupControls extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		for(let el of this.shadowRoot.querySelectorAll('m-colorpick')) {
			el.addEventListener('click', evt => {
				this.shadowRoot.querySelectorAll('m-colorpick').forEach(x => x.removeAttribute('selected'));
				let val = evt.target.getAttribute('val');
				this.shadowRoot.querySelector(`m-colorpick[val="${val}"]`).setAttribute('selected', true);
				this.dispatchEvent(new CustomEvent('pick-color', {detail: val}));
			});
		}

		this.shadowRoot.querySelector('#button-reset').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-reset'));
		});
		this.shadowRoot.querySelector('#button-empty').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-empty'));
		});
		this.shadowRoot.querySelector('#button-shuffle').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-shuffle'));
		});
		this.shadowRoot.querySelector('#button-solve').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-solve'));
		});
	}

	// TODO: remove this
	getSelectedColor() {
		return this.shadowRoot.querySelector('m-colorpick[selected]').getAttribute('val');
	}

	get selectedColor() {
		return this.shadowRoot.querySelector('m-colorpick[selected]').getAttribute('val');
	}
}

customElements.define('m-setup-controls', SetupControls);
