const template = document.createElement('template');
template.innerHTML = require('./solution-progress.html');


export default class SolutionProgress extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._solution = null;
	}

	set solution(sol) {
		this._solution = sol;

		this.shadowRoot.host.style.backgroundPositionX = 0;

		this._setTurns();
		this._setIndexButtons();
	}

	_setTurns() {
		let el = this.shadowRoot.querySelector('#turns');

		// remove all children
		while(el.firstChild) el.removeChild(el.firstChild);

		for(let i=0; i<this._solution.length; i++) {
			let turn = this._solution[i];

			let el_turn = document.createElement('div');
			el_turn.textContent = turn[0] + [, '', '2', "'"][turn[1]];
			el.appendChild(el_turn);
		}
	}

	_setIndexButtons() {
		let el = this.shadowRoot.querySelector('#buttons');

		// remove all children
		while(el.firstChild) el.removeChild(el.firstChild);

		for(let i=0; i<=this._solution.length; i++) {
			let el_btn = document.createElement('div');
			el_btn.onclick = evt => {
				this.dispatchEvent(new CustomEvent('set-index', {detail: i}));
			};
			el.appendChild(el_btn);
		}
	}

	updateProgress(startIndex, step, duration) {
		let hostStyle = this.shadowRoot.host.style;
		hostStyle.transitionDuration = duration + 'ms';
		hostStyle.backgroundPositionX = ((startIndex + step)/this._solution.length*100) + '%';
	}
}

customElements.define('m-solution-progress', SolutionProgress);
