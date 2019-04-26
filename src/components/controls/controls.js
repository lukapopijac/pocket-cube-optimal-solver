import './controls.css';
import html2element from '/html2element.js';

import Button from '../button/button.js';

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

		this.element = html2element(`
			<div class="controls">
				<div class="controls-row">
					<div class="color-pick" data-val="l"></div>
					<div class="color-pick" data-val="b"></div>
					<div class="color-pick" data-val="d"></div>
					<div class="color-pick" data-val="f"></div>
					<div class="color-pick" data-val="r"></div>
					<div class="color-pick" data-val="u"></div>
				</div>
				<div class="controls-row">
					<div class="color-pick" data-val="."></div>
					<div class="button-container">
						<button type="button" class="button reset">Reset</button>
						<button type="button" class="button empty">Empty</button>
						<button type="button" class="button shuffle">Shuffle</button>
					</div>
				</div>
				<div class="controls-row">
					<button type="button" class="button solve">Solve</button>
				</div>
				${new Button({
					caption: 'direktni',
					onClick: _ => {console.log('klik direktni', Math.random()*100|0)}		
				})}
			</div>
		`);

		let button = new Button({
			caption: 'novi',
			onClick: _ => {console.log('klik', Math.random()*100|0)}
		});

		this.element.appendChild(button.element);

		this._colorPickElements = Array.from(this.element.querySelectorAll('.color-pick'))
		
		// set click handler on each colorPick
		for(let el of this._colorPickElements) {
			el.addEventListener('click', evt => {
				this._state.selectedColor = evt.target.dataset.val;
				this._render();
			});
		}

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

	getSelectedColor() {
		return this._state.selectedColor;
	}

	_render(state) {
		if(!state) state = this._state;
		for(let el of this._colorPickElements) {
			el.classList.toggle('selected', el.dataset.val == state.selectedColor);
		}
	}
};



function rend(strings, ...parts) {
	let map = {};
	let htmlArray = [strings[0]];
	for(let i=0; i<parts.length; i++) {
		let part = parts[i];
		let element = null;
		if(part instanceof Element) element = part;
		else if(part && part.element instanceof Element) element = part.element;
		if(element) {
			let slotId = 'slot-' + Math.trunc(Math.random()*1e15);
			map[slotId] = element;
			htmlArray.push(`<slot id="${slotId}"></slot>`)	
		} else {
			htmlArray.push(parts[i]);
		}
		htmlArray.push(strings[i+1]);
	}

	let el = html2element(htmlArray.join(''));

	for(let id in map) {
		let slot = el.querySelector('#' + id);
		slot.parentNode.replaceChild(map[id], slot);
	}

	return el;
}


let el1 = {
	element: html2element('<div>jedan div</div>')
};

let el2 = {
	element: html2element('<a>neki link</a>')
};

let el3 = html2element('<div>divina</div>');


let ee = rend`
	<div id="vanjski">
		${el1}
		<span>neki span</span>
		<div>
			${'nekav direktan string'}
		</div>
		<div>
			${el2}
		</div>
		<article>
			${el3}
		</article>
	</div>
`;

console.log(ee);
