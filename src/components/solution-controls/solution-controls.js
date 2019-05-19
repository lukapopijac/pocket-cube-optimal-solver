import '../button/button.js';

import t from './solution-controls.html';
const template = document.createElement('template');
template.innerHTML = t;


// TODO:
// when playing has ended (e.g. when pause has been pressed) it is easy to stop
// the cube. but now solution-controls has to know on which move has playing ended.
// to know that, one solution could be: on each turn (either at the beginning or end 
// of turnanimation) cube3d should dispatch an event, and solution-controls should
// count steps.


class SolutionControls extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._el_playpause = this.shadowRoot.querySelector('.button-play-pause');
		this._el_step = this.shadowRoot.querySelector('.button-step');

		this._solution = null;
		this._stepIndex = 0;
		this._isPlaying = false;

		this._el_playpause.textContent = this._isPlaying ? '||' : '>';

		this._el_playpause.addEventListener('click', evt => {
			if(this._isPlaying) {
				this.setIsPlaying(false);
				this.dispatchEvent(new CustomEvent('pause'));
			} else {
				if(this._stepIndex >= this._solution.length) return;
				this.setIsPlaying(true);
				let turns = this._solution.slice(this._stepIndex);
				this._stepIndex = this._solution.length;
				this.dispatchEvent(new CustomEvent('play', {detail: {turns}}));
			}			
		});

		this._el_step.addEventListener('click', evt => {
			if(this._stepIndex >= this._solution.length) return;
			this._stepIndex++;
			let turn = this._solution[this._stepIndex];
			this.dispatchEvent(new CustomEvent('step', {detail: {turn}}));
		});
	}

	setIsPlaying(x) {
		this._isPlaying = x;
		if(this._isPlaying) {
			this._el_playpause.textContent = '||';
		} else {
			this._el_playpause.textContent = '>';
		}
	}

	set solution(sol) {
		this._solution = sol;
		// this.shadowRoot.querySelector('div').textContent = this._formatSolution(sol);
		this._setProgressControl();
	}

	_setProgressControl() {
		this._stepIndex = 0;
		let el = this.shadowRoot.querySelector('.turns');
		
		// remove all children
		while(el.firstChild) el.removeChild(el.firstChild);

		for(let i=0; i<=this._solution.length; i++) {
			let turn = this._solution[i] || '';
			
			let b = document.createElement('button');
			b.onclick = evt => {
				let turns, direction;
				if(i >= this._stepIndex) {
					direction = 'forward';
					turns = this._solution.slice(this._stepIndex, i);
				} else {
					direction = 'backward';
					turns = this._solution
						.slice(i, this._stepIndex)
						.reverse()
						.map(t => t[0] + (4-t[1]))
					;
				}
				this._stepIndex = i;
				this.shadowRoot.querySelector('progress').value = i;

				this.dispatchEvent(new CustomEvent('change', {detail: {
					turns,
					direction
				}}));
			};
			el.appendChild(b);
			el.appendChild(document.createTextNode(this._formatTurn(turn)));
		}

		let el_progress = this.shadowRoot.querySelector('progress')
		el_progress.max = this._solution.length;
		el_progress.value = 0;
		el_progress.style.width = (el.getBoundingClientRect().width - 20) + 'px';
	}

	_reverseTurns(turns) {
		return turns.slice().reverse().map(t => (t[0] + (4-t[1])));
	}
	_formatTurn(turn) {
		return turn && turn[0] + [, '', '2', "'"][turn[1]];
	}
	_formatSolution(solution) {
		return solution.map(x => x[1]=='1' ? x[0] : x[1]=='3' ? x[0]+"'" : x).join(' ')
	}
}

customElements.define('m-solution-controls', SolutionControls);
