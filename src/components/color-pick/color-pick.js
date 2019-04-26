import './color-pick.css';
import makeElement from '/html2element.js';

export default class {
	constructor({onClick, val}) {
		this._state = {
			selected: false
		};

		this.element = makeElement`
			<div class="color-pick" data-val="${val}"></div>
		`;

		this._render();
		
		this.element.addEventListener('click', evt => {
			this._state.selected = true;
			this._render();
			onClick();
		});
	}

	_render() {
		this.element.classList.toggle('selected', this._state.selected);
	}

	select(v) {
		this._state.selected = v;
		this._render();
	}
};
