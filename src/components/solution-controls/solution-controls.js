import '../button/button.js';
import Animate from '../../animate.js';


import t from './solution-controls.html';
const template = document.createElement('template');
template.innerHTML = t;


export default class SolutionControls extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._el_playpause = this.shadowRoot.querySelector('.button-play-pause');
		this._el_step = this.shadowRoot.querySelector('.button-step');
		this._el_progress = this.shadowRoot.querySelector('progress');

		this._solution = null;
		this._stepIndex = 0;
		this._isPlaying = false;
		this._stepFn = _ => _;
		this._stopFn = _ => _;

		this._progressAnimation = null;

		this._setIsPlaying(false);

		this._el_playpause.addEventListener('click', async evt => {
			if(this._isPlaying) this._pause();
			else this._play(this._solution.length);
		});
		this._el_step.addEventListener('click', async evt => {
			this._step();
		});
	}


	async _play(toIdx) {
		this._setIsPlaying(true);

		// stop in case there is an active move
		await this._stopFn();

		let turns, direction, turnDuration;
		if(toIdx >= this._stepIndex) {  // forward
			direction = 1;
			turns = this._solution.slice(this._stepIndex, toIdx);
			turnDuration = { quarter: 350, half: 490 };
		} else {  // backward
			direction = -1;
			turns = this._solution.slice(toIdx, this._stepIndex).reverse().map(t => t[0] + (4-t[1]));
			turnDuration = { quarter: 100, half: 140 };
		}

		for(let turn of turns) {
			let duration = turn[1] == 2 ? turnDuration.half : turnDuration.quarter;
			this._updateProgress(direction, duration);
			await this._stepFn(turn, duration);
		}

		this._setIsPlaying(false);
	}

	async _pause() {
		this._setIsPlaying(false);
		await this._stopFn();
	}

	async _step() {
		this._setIsPlaying(false);
		if(this._stepIndex >= this._solution.length) return;

		// stop in case there is an active move
		await this._stopFn();

		let turn = this._solution[this._stepIndex];
		let duration = turn[1] == 2 ? 700 : 500;

		this._updateProgress(1, duration);
		await this._stepFn(turn, duration);
	}

	_setIsPlaying(x) {
		this._isPlaying = x;
		if(this._isPlaying) {
			this._el_playpause.textContent = '||';
		} else {
			this._el_playpause.textContent = '>';
		}
	}

	_updateProgress(step, duration) {
		this._progressAnimation = new Animate({
			duration,
			startVal: this._stepIndex,
			endVal: this._stepIndex + step,
			updateFn: val => this._el_progress.value = val,
			easing: x => x
		});
		this._stepIndex += step;
		this._progressAnimation.run();
	}

	set solution(sol) {
		this._solution = sol;
		this._setProgressControl();
	}

	set stepFunction(stepFn) {
		this._stepFn = stepFn;
	}

	set stopFunction(stopFn) {
		this._stopFn = stopFn;
	}

	_setProgressControl() {
		this._stepIndex = 0;
		let el = this.shadowRoot.querySelector('.turns');
		
		// remove all children
		while(el.firstChild) el.removeChild(el.firstChild);

		for(let i=0; i<=this._solution.length; i++) {
			let turn = this._solution[i] || '';
			
			let b = document.createElement('button');
			b.onclick = evt => { this._play(i); };
			el.appendChild(b);

			if(turn) {
				let el_turn = document.createElement('span');
				el_turn.textContent = this._formatTurn(turn);
				el_turn.style.display = 'inline-block';
				el_turn.style.width = '20px';
				el.appendChild(el_turn);
			}
		}

		this._el_progress.max = this._solution.length;
		this._el_progress.value = 0;
		this._el_progress.style.width = (44 * this._solution.length) + 'px';
	}

	_formatTurn(turn) {
		return turn && turn[0] + [, '', '2', "'"][turn[1]];
	}
	_formatSolution(solution) {
		return solution.map(x => x[1]=='1' ? x[0] : x[1]=='3' ? x[0]+"'" : x).join(' ')
	}
}

customElements.define('m-solution-controls', SolutionControls);
