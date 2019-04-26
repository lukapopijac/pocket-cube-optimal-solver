import './controls.css';
import makeElement from '/html2element.js';

import Button from '../button/button.js';
import ColorPick from '../color-pick/color-pick.js';

export default class {
	constructor({
		onSolvedStateButtonClick,
		onEmptyStateButtonClick,
		onShuffledStateButtonClick,
		onSolveButtonClick
	}) {
		this._state = {
			selectedColor: '.'
		};

		let setSelectedColor = val => {
			this._state.selectedColor = val;
			this._render();
		}

		this._colorPicks = {};
		let cps = this._colorPicks;

		this.element = makeElement`
			<div class="controls">
				<div class="controls-row">
					${cps['l'] = new ColorPick({onClick: _ => setSelectedColor('l'), val: 'l'})}
					${cps['b'] = new ColorPick({onClick: _ => setSelectedColor('b'), val: 'b'})}
					${cps['d'] = new ColorPick({onClick: _ => setSelectedColor('d'), val: 'd'})}
					${cps['f'] = new ColorPick({onClick: _ => setSelectedColor('f'), val: 'f'})}
					${cps['r'] = new ColorPick({onClick: _ => setSelectedColor('r'), val: 'r'})}
					${cps['u'] = new ColorPick({onClick: _ => setSelectedColor('u'), val: 'u'})}
				</div>
				<div class="controls-row">
					${cps['.'] = new ColorPick({onClick: _ => setSelectedColor('.'), val: '.'})}
					<div class="button-container">
						${new Button({caption: 'Reset', onClick: onSolvedStateButtonClick})}
						${new Button({caption: 'Empty', onClick: onEmptyStateButtonClick})}
						${new Button({caption: 'Shuffle', onClick: onShuffledStateButtonClick})}
					</div>
				</div>
				<div class="controls-row">
					${new Button({caption: 'Solve', onClick: onSolveButtonClick, primary: true})}
				</div>
			</div>
		`;
	}

	getSelectedColor() {
		return this._state.selectedColor;
	}

	_render() {
		for(let val in this._colorPicks) {
			this._colorPicks[val].select(val == this._state.selectedColor);
		}
	}
};
