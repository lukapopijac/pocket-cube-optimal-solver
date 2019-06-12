import Animate from '../../animate.js';

const template = document.createElement('template');
template.innerHTML = require('./solution-progress.html');


export default class SolutionProgress extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._el_progress = this.shadowRoot.querySelector('progress');
		this._el_progress2 = this.shadowRoot.querySelector('.progress');
		this._el_bar = this.shadowRoot.querySelector('.bar');

		this._solution = null;
		this._progressAnimation = null;
	}

	disconnectedCallback() {
		if(this._progressAnimation) this._progressAnimation.kill();
		this._progressAnimation = null;
	}


	set solution(sol) {
		this._solution = sol;
		this._setProgressControl();
	}

	_setProgressControl() {
		let el = this.shadowRoot.querySelector('.turns');

		// remove all children
		while(el.firstChild) el.removeChild(el.firstChild);

		for(let i=0; i<=this._solution.length; i++) {
			let turn = this._solution[i] || '';
			
			let b = document.createElement('div');
			b.className = 'button';
			b.onclick = evt => {
				this.dispatchEvent(new CustomEvent('set-index', {detail: i}));
			};
			el.appendChild(b);

			if(turn) {
				let el_turn = document.createElement('div');
				el_turn.className = 'turn';
				el_turn.textContent = this._formatTurn(turn);
				el.appendChild(el_turn);
			}
		}

		this._el_progress.max = this._solution.length;
		this._el_progress.value = 0;

		this._el_bar.style.width = '0';
	}

	updateProgress(startIndex, step, duration) {
		this._progressAnimation = new Animate({
			duration,
			startVal: startIndex/this._solution.length*100,
			endVal: (startIndex + step)/this._solution.length*100,
			updateFn: val => {
				this._el_bar.style.width = val + '%';
			},
			easing: x => x
		});
		this._progressAnimation.run();
	
		let aa = new Animate({
			duration,
			startVal: startIndex,
			endVal: startIndex + step,
			updateFn: val => {
				this._el_progress.value = val;
			},
			easing: x => x
		});
		aa.run();
	}


	_formatTurn(turn) {
		return turn && turn[0] + [, '', '2', "'"][turn[1]];
	}
	// _formatSolution(solution) {
	// 	return solution.map(x => x[1]=='1' ? x[0] : x[1]=='3' ? x[0]+"'" : x).join(' ')
	// }

}

customElements.define('m-solution-progress', SolutionProgress);
