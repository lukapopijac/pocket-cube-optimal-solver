import t from './cube3d.html';

const template = document.createElement('template');
template.innerHTML = t;

export class Cube3d extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._styleForResize = document.createElement('style');
		this.shadowRoot.appendChild(this._styleForResize);

		this._resize = this._resize.bind(this);

		this._cubeEl = this.shadowRoot.querySelector('.cube');
		this._lastTurn = null;

		this.shadowRoot.querySelectorAll('button')
			.forEach(el => el.addEventListener('click', evt => {
				let turn = evt.target.textContent;
				this._cubeEl.dataset.turn = turn;
				this._lastTurn = turn;
			}))
		;
	}

	connectedCallback() {
		this._resize();
		window.addEventListener('resize', this._resize);

		this.shadowRoot.querySelector('.cube').addEventListener('transitionend', evt => {
			this._cubeEl.removeAttribute('data-turn');
			let turn = this._lastTurn;

			// read previous p and o
			let {p, o} = evt.target.dataset;
			
			// set new p and o
			evt.target.dataset.p = turn2p[turn][p];
			evt.target.dataset.o = (o + turn2oAdd[turn][p]) % 3;
		});
	}
	disconnectedCallback() {
		window.removeEventListener('resize', this._resize);
	}
	_resize() {
		// let el = this.shadowRoot.querySelector('div');
		// let w = el.offsetWidth;
		// console.log(w, el.offsetHeight);
		// this.scale = w/354;
	}

	set scale(s) {
		// for some reason directly atlering style on some element inside shadow dom doesn't work
		this._styleForResize.innerHTML = `:host > div { transform: scale(${s}); }`;
	}

}

customElements.define('m-cube3d', Cube3d);


function getNewPO(prevP, prevO, turn) {
	let p = turn2p[turn][prevP];
	let o = (prevO + turn2oAdd[turn][prevP]) % 3;
	return {p, o};
}



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





// function inversePermutation(arr) { 
// 	let b = [];
// 	// Loop to select Elements one by one 
// 	for (let i = 0; i < arr.length; i++) { 
	
// 	  // Loop to print position of element 
// 	  // where we find an element 
// 	  for (let j = 0; j < arr.length; j++) { 
	
// 		// checking the element in increasing order 
// 		if (arr[j] == i) { 
	
// 		  // print position of element where 
// 		  // element is in inverse permutation 
// 		  b.push(j);
// 		  break; 
// 		} 
// 	  } 
// 	} 
// 	return b;
//   } 
