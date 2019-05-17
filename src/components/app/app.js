import '../page-setup/page-setup.js';

import '../button/button.js';
import '../cube3d/cube3d.js';
import '../solution-controls/solution-controls.js';

import solve from '/solve.js';

import t from './app.html';

const template = document.createElement('template');
template.innerHTML = t;


export class App extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});

		this.shadowRoot.appendChild(template.content.cloneNode(true));
		// console.log(this.shadowRoot.querySelector('div'));

		// this._el_pageSetup = this.shadowRoot.querySelector('[data-page="setup"]');
		// this._el_pageSolution = this.shadowRoot.querySelector('[data-page="solution"]');
		// this.shadowRoot.removeChild(this._el_pageSolution);
	}

	connectedCallback() {
		this.shadowRoot.querySelector('m-page-setup').addEventListener('solve', evt => {
			let po = evt.detail;
	
			let data = solve(po.p, po.o);
			let solution = data.normalize.concat(data.solution);
			this.shadowRoot.querySelector('m-solution-controls').solution = solution;		
		
			let el_cube3d = this.shadowRoot.querySelector('m-cube3d');
			el_cube3d.po = po;
			this._setView('solution');
		});




		this.shadowRoot.querySelector('.button-back').addEventListener('click', _ => {
			this._setView('setup');
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

	_setView(view) {
		if(view == 'setup') {
			this.shadowRoot.querySelector('[data-page="setup"]').classList.remove('hidden');
			this.shadowRoot.querySelector('[data-page="solution"]').classList.add('hidden');
		}
		if(view == 'solution') {
			this.shadowRoot.querySelector('[data-page="setup"]').classList.add('hidden');
			this.shadowRoot.querySelector('[data-page="solution"]').classList.remove('hidden');
		}
	}
}

customElements.define('m-app', App);
