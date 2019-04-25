import './controls.css';
import html2element from '/html2element.js';

export default class {
	constructor({
		onSolvedStateButtonClick,
		onEmptyStateButtonClick,
		onShuffledStateButtonClick,
		onSolveButtonClick
	}) {
		this._state = {
		};

		this.element = html2element(`
			<div class="controls">
				<div class="controls-row">
					<div class="color-pick" data-v=1 ></div>
					<div class="color-pick" data-v=2 ></div>
					<div class="color-pick" data-v=4 ></div>
					<div class="color-pick" data-v=8 ></div>
					<div class="color-pick" data-v=16></div>
					<div class="color-pick" data-v=32></div>
				</div>
				<div class="controls-row">
					<div class="color-pick selected" data-v=0></div>
					<div class="button-container">
						<button type="button" class="button reset">Reset</button>
						<button type="button" class="button empty">Empty</button>
						<button type="button" class="button shuffle">Shuffle</button>
					</div>
				</div>
				<div class="controls-row">
					<button type="button" class="button solve">Solve</button>
				</div>
			</div>
		`);

		let colorPicks = Array.from(this.element.querySelectorAll('.color-pick'));

		// set click handler on each colorPick
		colorPicks.forEach(function(el) {
			el.addEventListener('click', function(evt) {
				document.querySelector('.color-pick.selected').classList.remove('selected');
				evt.target.classList.add('selected');
			});
		});

		// set click handler on button 'reset'
		this.element.querySelector('.button.reset').addEventListener('click', function(evt) {
			onSolvedStateButtonClick();
		});

		// set click handler on button 'empty'
		this.element.querySelector('.button.empty').addEventListener('click', function(evt) {
			onEmptyStateButtonClick();
		});

		// set click handler on button 'shuffle'
		this.element.querySelector('.button.shuffle').addEventListener('click', function(evt) {
			onShuffledStateButtonClick();
		});

		// set click handler on button 'solve'
		this.element.querySelector('.button.solve').addEventListener('click', function(evt) {
			onSolveButtonClick();
		});


		this._render();
	}

	_render(state) {
		if(!state) state = this._state;
	}
};
