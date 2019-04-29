import './controls.css';
import makeElement from '/html2element.js';

import '../button/button.js';
import '../color-pick/color-pick.js';

export default class {
	constructor({
		onSolvedStateButtonClick,
		onEmptyStateButtonClick,
		onShuffledStateButtonClick,
		onSolveButtonClick
	}) {
		this._colorPicks = {};
		let cps = this._colorPicks;

		this.element = makeElement`
			<div class="controls">
				<div class="controls-row">
					<m-colorpick val="l"></m-colorpick>
					<m-colorpick val="b"></m-colorpick>
					<m-colorpick val="d"></m-colorpick>
					<m-colorpick val="f"></m-colorpick>
					<m-colorpick val="r"></m-colorpick>
					<m-colorpick val="u"></m-colorpick>
				</div>
				<div class="controls-row">
					<m-colorpick val="."></m-colorpick>
					<div class="button-container">
						<m-button id="button-reset">Reset</m-button>
						<m-button id="button-empty">Empty</m-button>
						<m-button id="button-shuffle">Shuffle</m-button>
					</div>
				</div>
				<div class="controls-row">
					<m-button id="button-solve" primary>Solve</m-button>
				</div>
			</div>
		`;

		for(let el of this.element.querySelectorAll('m-colorpick')) {
			el.addEventListener('click', evt => {
				this.element.querySelectorAll('m-colorpick').forEach(x => x.removeAttribute('selected'));
				this.element.querySelector(`m-colorpick[val="${evt.target.val}"]`).setAttribute('selected', true);
			});
		}

		this.element.querySelector('#button-reset').addEventListener('click', onSolvedStateButtonClick);
		this.element.querySelector('#button-empty').addEventListener('click', onEmptyStateButtonClick);
		this.element.querySelector('#button-shuffle').addEventListener('click', onShuffledStateButtonClick);
		this.element.querySelector('#button-solve').addEventListener('click', onSolveButtonClick);
	}

	getSelectedColor() {
		return this.element.querySelector('m-colorpick[selected]').getAttribute('val');
	}
};
