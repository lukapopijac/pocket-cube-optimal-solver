import '../cube-unfolded/cube-unfolded.js';
import '../controls/controls.js';
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
	}

	connectedCallback() {
		let cubeUnfolded = this.shadowRoot.querySelector('m-cube-unfolded');
		let controls = this.shadowRoot.querySelector('m-controls');

		// prepare cubeUnfolded
		setTimeout(_ => {
			// for some reason a component doesn't have their methods ready right away
			cubeUnfolded.getSelectedColor = _ => controls.selectedColor;
		}, 0);
		cubeUnfolded.addEventListener('click-sticker', _ => {
			this._setMessage(null);
		});


		// prepare controls
		controls.addEventListener('click-reset', _ => {
			this._setMessage(null);
			cubeUnfolded.setStickersToSolved();
		});
		controls.addEventListener('click-empty', _ => {
			this._setMessage(null);
			cubeUnfolded.setStickersToEmpty();
		});
		controls.addEventListener('click-shuffle', _ => {
			this._setMessage(null);
			let {p, o} = generateRandomPO();
			cubeUnfolded.stickerValues = po2stickers(p, o);
		});
		controls.addEventListener('click-solve', _ => {
			let po = stickers2po(cubeUnfolded.stickerValues);
			if(!po) {
				this._setMessage('Invalid or ambiguous state!', true);
				return;
			}
			let data = solve(po.p, po.o);
			if(data.solution.length == 0) this._setMessage('Solved!');
			else {
				let el_cube3d = this.shadowRoot.querySelector('m-cube3d');
				el_cube3d.po = po;
				this._setView('solution');
				// this.shadowRoot.querySelector('.solution').textContent = formulateSolution(data);
				
				this.shadowRoot.querySelector('.solution').innerHTML = '';
				this.shadowRoot.querySelector('.solution').appendChild(this._formulateSolution2(data));
			}
		});
		controls.addEventListener('pick-color', evt => {
			cubeUnfolded.selectedColor = evt.detail;
		});


		this.shadowRoot.querySelector('.button-back').addEventListener('click', _ => {
			this._setView('setup');
		});
	}

	_setView(view) {
		if(view == 'setup') {
			this.shadowRoot.querySelector('[data-view="setup"]').classList.remove('hidden');
			this.shadowRoot.querySelector('[data-view="solution"]').classList.add('hidden');
		}
		if(view == 'solution') {
			this.shadowRoot.querySelector('[data-view="setup"]').classList.add('hidden');
			this.shadowRoot.querySelector('[data-view="solution"]').classList.remove('hidden');
		}
	}

	_setMessage(text, isError) {
		let msgElement = this.shadowRoot.querySelector('.message');

		if(text == null) {
			msgElement.classList.add('hidden');
		} else {
			msgElement.textContent = text;
			msgElement.classList.remove('hidden');
			if(isError) msgElement.classList.add('error');
			else msgElement.classList.remove('error');
		}
	}
	
	// TODO: this is temporary
	_formulateSolution2(data) {
		let el = document.createElement('div');
		for(let t of data.normalize.concat(data.solution)) {
			let b = document.createElement('button');
			b.textContent = t;
			b.onclick = evt => {
				let el_cube3d = this.shadowRoot.querySelector('m-cube3d');
				el_cube3d.move(evt.target.textContent);
			};
			el.appendChild(b);
		};
		return el;
	}
	
}

customElements.define('m-app', App);





// TODO: function below put in some other file

function generateRandomPO() {
	// generate p
	let p = [0, 1, 2, 3, 4, 5, 6, 7];
	for(let i=p.length-1; i>0; i--) {
		let j = Math.random()*(i+1) | 0;
		let b = p[i];
		p[i] = p[j];
		p[j] = b;
	}

	// generate o
	let o = [];
	let s = 0;
	for(let i=0; i<7; i++) {
		let r = Math.random()*3 | 0;
		o[i] = r;
		s += r;
	}
	o[7] = (30 - s) % 3;


	return {p, o};
}


const validCubies = [
	['urf', 'fur', 'rfu'],
	['ufl', 'luf', 'flu'],
	['ubr', 'rub', 'bru'],
	['ulb', 'bul', 'lbu'],
	['dfr', 'rdf', 'frd'],
	['dlf', 'fdl', 'lfd'],
	['drb', 'bdr', 'rbd'],
	['dbl', 'ldb', 'bld']
];



function po2stickers(p, o) {
	let cubies = [];
	for(let i=0; i<8; i++) {
		cubies[i] = validCubies[p[i]][o[i]];
	}
	return cubies.join('').split('');
}

function stickers2po(stickers) {
	let cubies = stickers.join('').match(/.{3}/g);
	
	let PO = [[], [], [], [], [], [], [], []];
	for(let k=0; k<8; k++) {
		let re = RegExp(cubies[k]);
		for(let i=0; i<8; i++) {
			for(let j=0; j<3; j++) {
				if(re.test(validCubies[i][j])) {
					PO[k].push({p: i, o: j});
				}
			}
		}
	}

	// validation: every position must contaion only one possible cubie
	for(let po of PO) if(po.length != 1) return null;

	// get return arrays
	let p = PO.map(x => x[0].p);
	let o = PO.map(x => x[0].o);

	// validation: every cubie must be unique
	let usedP = new Set();
	for(let x of p) {
		if(usedP.has(x)) return null;
		usedP.add(x);
	}

	// validation: orientations must sum to 0 mod 3
	let s = 0;
	for(let x of o) s += x;
	if(s%3 != 0) return null;

	return {p, o};
}


function formulateSolution(data) {
	return data.normalize
		.concat(data.solution)
		// .map(x => x[1]=='1' ? x[0] : x[1]=='3' ? x[0]+"'" : x)
		.join(' ')
	;
}

