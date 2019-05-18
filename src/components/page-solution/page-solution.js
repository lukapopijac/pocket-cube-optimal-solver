import '../button/button.js';
import '../cube3d/cube3d.js';
import '../solution-controls/solution-controls.js';

import t from './page-solution.html';
const template = document.createElement('template');
template.innerHTML = t;


export class PageSolution extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.shadowRoot.querySelector('.button-back').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('back'));
		});

		let el_solutionControls = this.shadowRoot.querySelector('m-solution-controls');
		let el_cube3d = this.shadowRoot.querySelector('m-cube3d');

		el_solutionControls.addEventListener('change', evt => {
			let {turns, direction} = evt.detail;
			let turnDuration = direction == 'forward' ? { quarter: 350, half: 490 } : { quarter: 100, half: 140 };
			el_cube3d.applyMoves(turns, turnDuration, true);
		});
		el_solutionControls.addEventListener('play', evt => {
			let {turns} = evt.detail;
			let turnDuration = { quarter: 350, half: 490 };
			el_cube3d.applyMoves(turns, turnDuration, true);
		});
		el_solutionControls.addEventListener('pause', evt => {
			el_cube3d.stop({ quarter: 70, half: 98 });
		});
		el_solutionControls.addEventListener('step', evt => {
			let {turn} = evt.detail;
			let turnDuration = { quarter: 500, half: 700 };
			el_cube3d.applyMoves([turn], turnDuration, true);
		});
	}

	set solution(sol) {
		this.shadowRoot.querySelector('m-solution-controls').solution = sol;
	}

	set po({p, o}) {
		let el_cube3d = this.shadowRoot.querySelector('m-cube3d');
		el_cube3d.po = {p, o};
	}
}

customElements.define('m-page-solution', PageSolution);
