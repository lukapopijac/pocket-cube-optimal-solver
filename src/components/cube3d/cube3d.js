import Animate from '../../animate.js';

const template = document.createElement('template');
template.innerHTML = require('./cube3d.html');

export default class Cube3d extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		
		this._el_cube = this.shadowRoot.querySelector('.cube');

		this._anim = null;
	}


	set po({p, o}) {
		for(let i=0; i<8; i++) {
			let slot = this.shadowRoot.querySelector(`[data-slot|="${i}"]`);
			let cubie = this.shadowRoot.querySelector(`[data-p="${p[i]}"]`);
			cubie.dataset.o = o[i];
			slot.appendChild(cubie);
		}
	}

	disconnectedCallback() {
		if(this._anim) this._anim.kill();
		this._anim = null;
	}

	connectedCallback() {
		let el_slots = this.shadowRoot.querySelectorAll('[data-slot]');
		for(let el_slot of el_slots) el_slot.style.transform = null;
	}

	async move(turn, duration = 2000) {  // duration is number of ms
		let el_slots = this.shadowRoot.querySelectorAll(`[data-slot*="${turn[0]}"]`);
		let el_turnLayer = document.createElement('div');
		el_turnLayer.dataset.turn = turn;
		el_turnLayer.append(...el_slots);
		this._el_cube.append(el_turnLayer);

		this._anim = new Animate({
			duration,
			updateFn: val => el_turnLayer.style.setProperty('--coef', val),
			onComplete: _ => {
				this._anim = null;
				el_turnLayer.parentNode.append(...el_turnLayer.children);
				el_turnLayer.remove();
				this._updateCubies(turn);
			}
		});

		let stop = await this._anim.run();


		return stop;
	}

	async stop() {
		if(this._anim) {
			return await this._anim.wait(true);  // stop = true
		}
		
		// if(this._anim) return this._anim.stealResolve();
	}

	_updateCubies(turn) {
		let el_cubies = this.shadowRoot.querySelectorAll('[data-p][data-o]');

		for(let el_cubie of el_cubies) {
			let slotIdx = +el_cubie.parentNode.dataset.slot.split('-')[0];
			el_cubie.dataset.o = (el_cubie.dataset.o + turn2oAdd[turn][slotIdx]) % 3;
			let el_newSlot = this.shadowRoot.querySelector(`[data-slot|="${turn2p[turn][slotIdx]}"]`);
			el_newSlot.appendChild(el_cubie);
		}
	}
}

customElements.define('m-cube3d', Cube3d);




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
