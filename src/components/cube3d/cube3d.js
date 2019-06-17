import Animate from '../../animate.js';

const template = document.createElement('template');
template.innerHTML = require('./cube3d.html');

export default class Cube3d extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		
		this._el_cube = this.shadowRoot.querySelector('.cube');

		this._el_cube.addEventListener('transitionend', evt => {
			let el_slot = evt.target;
			el_slot.style.transform = null;
			el_slot.style.transitionDuration = null;

			if(this._animTurn) {
				this._updateCubies(this._animTurn);
				this._animTurn = null;
				this._animRequestId = requestAnimationFrame(_ => {
					this._animRequestId = requestAnimationFrame(_ => {
						this._animResolve();
					});
				});
			}
		});

		this._animTurn = null;
		this._animResolve = null;
		this._animRequestId = null;
	}


	set po({p, o}) {
		for(let i=0; i<8; i++) {
			let slot = this.shadowRoot.querySelector(`[data-slot|="${i}"]`);
			let cubie = this.shadowRoot.querySelector(`[data-p="${p[i]}"]`);
			cubie.dataset.o = o[i];
			slot.appendChild(cubie);
		}
	}

	get po() {

	}

	disconnectedCallback() {
		cancelAnimationFrame(this._animRequestId);
		this._animTurn = null;
		// el_slot.style.transform = null;
		// el_slot.style.transitionDuration = null;
	}

	connectedCallback() {
		let el_slots = this.shadowRoot.querySelectorAll('[data-slot]');
		for(let el_slot of el_slots) el_slot.style.transform = null;
	}

	// make the turn. if other turn is in progress, first complete that turn instantly.
	async move(turn, duration = 2000) {  // duration is number of ms
		let rotationVector = side2rotationVector[turn[0]];
		let finalAngle = step2angle[turn[1]];

		let el_slots = this.shadowRoot.querySelectorAll(`[data-slot*="${turn[0]}"]`);

		this._animTurn = turn;
		for(let el of el_slots) {
			el.style.transitionDuration = duration + 'ms';
			el.style.transform = `rotate3d(${rotationVector}, ${finalAngle}deg)`;
		}

		return new Promise(resolve => { this._animResolve = resolve; });
	}

	async stop() {
		if(this._animTurn) return new Promise(resolve => { this._animResolve = resolve; });
	}

	_updateCubies(turn) {
		let slots = [...this.shadowRoot.querySelectorAll('[data-slot]')];

		slots.sort((a, b) => +a.dataset.slot.split('-')[0] - (+b.dataset.slot.split('-')[0]));

		// let cubies = this.shadowRoot.querySelectorAll('[data-slot] > div');
		for(let i=0; i<8; i++) {
			let cubie = slots[i].firstElementChild;
			cubie.dataset.o = (cubie.dataset.o + turn2oAdd[turn][i]) % 3;
			let el_slot = slots[turn2p[turn][i]];
			el_slot.appendChild(cubie);
		}

	}
}

customElements.define('m-cube3d', Cube3d);




const step2angle = [, 90, 180, -90];
const side2rotationVector = {
	U: [ 0, -1,  0],
	R: [ 1,  0,  0],
	F: [ 0,  0,  1],
	L: [-1,  0,  0],
	B: [ 0,  0, -1],
	D: [ 0,  1,  0],
	x: [ 1,  0,  0],
	y: [ 0, -1,  0],
	z: [ 0,  0,  1],
};


const turn2p = {
	U1: [1,3,0,2,4,5,6,7], U2: [3,2,1,0,4,5,6,7], U3: [2,0,3,1,4,5,6,7],
	R1: [2,1,6,3,0,5,4,7], R2: [6,1,4,3,2,5,0,7], R3: [4,1,0,3,6,5,2,7],
	F1: [4,0,2,3,5,1,6,7], F2: [5,4,2,3,1,0,6,7], F3: [1,5,2,3,0,4,6,7],
	L1: [0,5,2,1,4,7,6,3], L2: [0,7,2,5,4,3,6,1], L3: [0,3,2,7,4,1,6,5],
	B1: [0,1,3,7,4,5,2,6], B2: [0,1,7,6,4,5,3,2], B3: [0,1,6,2,4,5,7,3],
	D1: [0,1,2,3,6,4,7,5], D2: [0,1,2,3,7,6,5,4], D3: [0,1,2,3,5,7,4,6],
	x1: [2,3,6,7,0,1,4,5], x2: [6,7,4,5,2,3,0,1], x3: [4,5,0,1,6,7,2,3],
	y1: [1,3,0,2,5,7,4,6], y2: [3,2,1,0,7,6,5,4], y3: [2,0,3,1,6,4,7,5],
	z1: [4,0,6,2,5,1,7,3], z2: [5,4,7,6,1,0,3,2], z3: [1,5,3,7,0,4,2,6],
};

const turn2oAdd = {
	U1: [0,0,0,0,0,0,0,0], U2: [0,0,0,0,0,0,0,0], U3: [0,0,0,0,0,0,0,0],
	R1: [1,0,2,0,2,0,1,0], R2: [0,0,0,0,0,0,0,0], R3: [1,0,2,0,2,0,1,0],
	F1: [2,1,0,0,1,2,0,0], F2: [0,0,0,0,0,0,0,0], F3: [2,1,0,0,1,2,0,0],
	L1: [0,2,0,1,0,1,0,2], L2: [0,0,0,0,0,0,0,0], L3: [0,2,0,1,0,1,0,2],
	B1: [0,0,1,2,0,0,2,1], B2: [0,0,0,0,0,0,0,0], B3: [0,0,1,2,0,0,2,1],
	D1: [0,0,0,0,0,0,0,0], D2: [0,0,0,0,0,0,0,0], D3: [0,0,0,0,0,0,0,0],
	x1: [1,2,2,1,2,1,1,2], x2: [0,0,0,0,0,0,0,0], x3: [1,2,2,1,2,1,1,2],
	y1: [0,0,0,0,0,0,0,0], y2: [0,0,0,0,0,0,0,0], y3: [0,0,0,0,0,0,0,0],
	z1: [2,1,1,2,1,2,2,1], z2: [0,0,0,0,0,0,0,0], z3: [2,1,1,2,1,2,2,1],
};
