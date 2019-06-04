import '../button/button.js';
import Cube3d from '../cube3d/cube3d.js';
import SolutionControls from '../solution-controls/solution-controls.js';

import t from './page-solution.html';
const template = document.createElement('template');
template.innerHTML = t;


class PageSolution extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.shadowRoot.querySelector('.button-back').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('back'));
		});

		let el_cube3d = new Cube3d();
		this.shadowRoot.appendChild(el_cube3d);

		this.shadowRoot.appendChild(document.createElement('br'));

		this._el_solutionControls = new SolutionControls();
		this.shadowRoot.appendChild(this._el_solutionControls);

		this._el_solutionControls.stepFunction = el_cube3d.move.bind(el_cube3d);
		this._el_solutionControls.stopFunction = el_cube3d.stop.bind(el_cube3d);
	}

	set solution(sol) {
		this._el_solutionControls.solution = sol;
	}

	set po({p, o}) {
		let el_cube3d = this.shadowRoot.querySelector('m-cube3d');
		el_cube3d.po = {p, o};
	}
}

customElements.define('m-page-solution', PageSolution);
