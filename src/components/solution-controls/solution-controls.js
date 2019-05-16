import t from './solution-controls.html';
const template = document.createElement('template');
template.innerHTML = t;

class SolutionControls extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._solution = null;
		this._stepIndex = 0;
	}

	set solution(sol) {
		this._solution = sol;
		// this.shadowRoot.querySelector('div').textContent = this._formatSolution(sol);
		this._setProgressControl();
	}

	_setProgressControl() {
		let el = this.shadowRoot.querySelector('.turns');
		
		// remove all children
		while(el.firstChild) el.removeChild(el.firstChild);

		for(let i=0; i<=this._solution.length; i++) {
			let turn = this._solution[i] || '';
			
			let b = document.createElement('button');
			b.onclick = evt => {
				let turns;
				if(i >= this._stepIndex) {
					turns = this._solution.slice(this._stepIndex, i);
				} else {
					turns = this._solution
						.slice(i, this._stepIndex)
						.reverse()
						.map(t => t[0] + (4-t[1]))
					;
				}
				console.log(turns);
				this._stepIndex = i;
				this.shadowRoot.querySelector('progress').value = i;

				this.dispatchEvent(new CustomEvent('change', {detail: {turns, duration: 3000}}));
			};
			el.appendChild(b);
			el.appendChild(document.createTextNode(this._formatTurn(turn)));
		}

		let el_progress = this.shadowRoot.querySelector('progress')
		el_progress.max = this._solution.length;
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
