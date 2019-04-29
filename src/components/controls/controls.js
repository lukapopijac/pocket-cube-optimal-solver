import '../button/button.js';
import '../color-pick/color-pick.js';

import t from './controls.html';

const template = document.createElement('template');
template.innerHTML = t;

export class Controls extends HTMLElement {
	constructor({
		onSolvedStateButtonClick,
		onEmptyStateButtonClick,
		onShuffledStateButtonClick,
		onSolveButtonClick
	}) {
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

		this._el.querySelector('#button-reset').addEventListener('click', onSolvedStateButtonClick);
		this._el.querySelector('#button-empty').addEventListener('click', onEmptyStateButtonClick);
		this._el.querySelector('#button-shuffle').addEventListener('click', onShuffledStateButtonClick);
		this._el.querySelector('#button-solve').addEventListener('click', onSolveButtonClick);
	}

	getSelectedColor() {
		return this._el.querySelector('m-colorpick[selected]').getAttribute('val');
	}
}

customElements.define('m-controls', Controls);
