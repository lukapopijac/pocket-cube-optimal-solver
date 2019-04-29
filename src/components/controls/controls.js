import '../button/button.js';
import '../color-pick/color-pick.js';

import t from './controls.html';

const template = document.createElement('template');
template.innerHTML = t;

export class Controls extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this._el = this.shadowRoot.querySelector('div');

		for(let el of this._el.querySelectorAll('m-colorpick')) {
			el.addEventListener('click', evt => {
				this._el.querySelectorAll('m-colorpick').forEach(x => x.removeAttribute('selected'));
				let val = evt.target.getAttribute('val');
				this._el.querySelector(`m-colorpick[val="${val}"]`).setAttribute('selected', true);
			});
		}

		this._el.querySelector('#button-reset').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-reset'));
		});
		this._el.querySelector('#button-empty').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-empty'));
		});
		this._el.querySelector('#button-shuffle').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-shuffle'));
		});
		this._el.querySelector('#button-solve').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('click-solve'));
		});
	}

	getSelectedColor() {
		return this._el.querySelector('m-colorpick[selected]').getAttribute('val');
	}
}

customElements.define('m-controls', Controls);
