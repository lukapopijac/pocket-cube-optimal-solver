import '../button/button.js';
import '../solution-progress/solution-progress.js';

const template = document.createElement('template');
template.innerHTML = require('./solution-controls.html');


const turnDuration = {
	slow:   [750, 500],  // half-turn, quarter-turn
	normal: [600, 400],
	fast:   [150, 100]
};


export default class SolutionControls extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._el_stepBackward     = this.shadowRoot.querySelector('#button-stepbackward');
		this._el_play             = this.shadowRoot.querySelector('#button-play');
		this._el_pause            = this.shadowRoot.querySelector('#button-pause');
		this._el_stepForward      = this.shadowRoot.querySelector('#button-stepforward');
		this._el_solutionProgress = this.shadowRoot.querySelector('m-solution-progress');

		this._solution = null;
		this._stepIndex = 0;
		this._isPlaying = false;
		this._stepFn = _ => _;

		this._buffer = {
			turns: [],
			speed: null,
			direction: 0
		};

		this._animationActive = false;
		this._animationRequest = null;

		this._el_stepBackward.addEventListener('click', _ => {
			if(this._stepIndex == 0) return;
			this._prepareBuffer(this._stepIndex - 1, 'slow');
			this._setIsPlaying(false);
		});
		this._el_play.addEventListener('click', _ => {
			if(this._stepIndex == this._solution.length) return;
			this._prepareBuffer(this._solution.length, 'normal');
			this._setIsPlaying(true);
		});
		this._el_pause.addEventListener('click', _ => {
			this._buffer.turns = [];
			this._setIsPlaying(false);
		});
		this._el_stepForward.addEventListener('click', _ => {
			if(this._stepIndex == this._solution.length) return;
			this._prepareBuffer(this._stepIndex + 1, 'slow');
			this._setIsPlaying(false);
		});

		this._el_solutionProgress.addEventListener('set-index', evt => {
			let toIdx = evt.detail;
			if(this._stepIndex == toIdx) return;
			this._prepareBuffer(toIdx, 'fast');
			this._setIsPlaying(true);
		});

		this._applyMovesFromBuffer = this._applyMovesFromBuffer.bind(this);
	}

	connectedCallback() {
		this._setIsPlaying(false);
		this._animationRequest = requestAnimationFrame(this._applyMovesFromBuffer);
	}

	disconnectedCallback() {
		cancelAnimationFrame(this._animationRequest);
		this._animationActive = false;
	}

	async _applyMovesFromBuffer() {
		this._animationRequest = requestAnimationFrame(this._applyMovesFromBuffer);
		if(this._animationActive || this._buffer.turns.length == 0) return;
		this._animationActive = true;
		while(this._buffer.turns.length > 0) {
			let turn = this._buffer.turns.shift();
			let duration = turnDuration[this._buffer.speed][turn[1]%2];
			this._el_solutionProgress.updateProgress(this._stepIndex, this._buffer.direction, duration);
			this._stepIndex += this._buffer.direction;
			await this._stepFn(turn, duration);
		}
		this._animationActive = false;
		this._setIsPlaying(false);
	}

	_prepareBuffer(toIdx, speed) {
		this._buffer.speed = speed;
		if(toIdx >= this._stepIndex) {  // forward
			this._buffer.direction = 1;
			this._buffer.turns = this._solution.slice(this._stepIndex, toIdx);
		}
		if(toIdx < this._stepIndex) {  // backward
			this._buffer.direction = -1;
			this._buffer.turns = this._solution.slice(toIdx, this._stepIndex).reverse().map(t => t[0] + (4-t[1]));
		}
	}

	_setIsPlaying(x) {
		this._isPlaying = x;
		if(this._isPlaying) {
			this._el_play.hidden = true;
			this._el_pause.hidden = false;
		} else {
			this._el_play.hidden = false;
			this._el_pause.hidden = true;
		}
	}

	set solution(sol) {
		this._solution = sol;
		this._el_solutionProgress.solution = sol;
		this._stepIndex = 0;
	}

	set stepFunction(stepFn) {
		this._stepFn = stepFn;
	}
}

customElements.define('m-solution-controls', SolutionControls);
