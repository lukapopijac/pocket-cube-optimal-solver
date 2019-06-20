import '../button/button.js';
import Cube3d from '../cube3d/cube3d.js';
import SolutionControls from '../solution-controls/solution-controls.js';

const template = document.createElement('template');
template.innerHTML = require('./page-solution.html');


class PageSolution extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.shadowRoot.querySelector('.button-back').addEventListener('click', _ => {
			this.dispatchEvent(new CustomEvent('back'));
		});

		this._el_cube3d = new Cube3d();
		this._el_solutionControls = new SolutionControls();

		this.shadowRoot.querySelector('.container').append(this._el_cube3d);
		this.shadowRoot.querySelector('.container').append(this._el_solutionControls);

		this._el_solutionControls.animateTurn = this._el_cube3d.animateTurn.bind(this._el_cube3d);
	}

	set solution(sol) {
		this._el_solutionControls.solution = sol;
	}

	set po({p, o}) {
		this._el_cube3d.po = {p, o};
	}
}

customElements.define('m-page-solution', PageSolution);
