import './button.css';
import html2element from '/html2element.js';

export default class {
	constructor({caption, onClick}) {
		this._state = {
			caption
		};

		this.element = html2element(`
			<button type="button" class="button">${caption}</button>
		`);

		this.element.addEventListener('click', onClick);

		this._render();
	}

	_render(state) {
		if(!state) state = this._state;
	}
};
