import t from './cube3d.html';

const template = document.createElement('template');
template.innerHTML = t;

export class Cube3d extends HTMLElement {
	constructor() {
		super();
		
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		
		this._el_cube = this.shadowRoot.querySelector('.cube');

		this._nextMoves = [];
		
		// for debugging: start
		this.shadowRoot.querySelectorAll('button:not(.special-button)')
			.forEach(el => el.addEventListener('click', evt => {
				let turn = evt.target.textContent;
				this.move(turn);
			}))
		;
		this.shadowRoot.querySelector('.special-button').onclick = _ => {
			this.move('U1', 3000);
			// this.move('R1', 3000);
		};
		// for debugging: end
	}

	set po({p, o}) {
		let el_cubies = this.shadowRoot.querySelectorAll('[data-p]');
		for(let i=0; i<el_cubies.length; i++) {
			el_cubies[p[i]].dataset.p = i;
			el_cubies[p[i]].dataset.o = o[i];
		}
		console.log('set', p, o);
	}

	get po() {

	}

	// make the turn. if other turn is in progress, first complete that turn instantly.
	move(turn, duration) {  // duration is number of ms
		// wind-up any current turn animation
		this._turnAnimationWindUp();

		if(this._nextMoves.length > 0) {
			// no turn animation in progress, but the next turn is already setup. complete it immediately
			while(this._nextMoves.length > 0) this._updateCubies(this._nextMoves.shift().turn);
		} else {
			runSoon(_ => {
				let {duration, turn} = this._nextMoves.shift();
				if(duration == 0) {
					this._updateCubies(turn);
				} else {
					for(let el of this._el_cube.querySelectorAll('[data-p]')) {
						el.style.transitionDuration = duration ? duration + 'ms' : null;
					}
					this._el_cube.dataset.turn = turn;
				}
			});
		}

		this._nextMoves.push({turn, duration});
	}

	applyMoves(turns, duration) {
		for(let turn of turns) {
			console.log(turn);
			this.move(turn, duration/turns.length);
		}

	}



	_turnAnimationWindUp() {
		let turn = this._el_cube.dataset.turn;
		if(turn) {
			this._el_cube.removeAttribute('data-turn');			
			for(let el of this._el_cube.querySelectorAll('[data-p]')) {
				el.style.transitionDuration = null;
			}
			this._updateCubies(turn);
		}
	}

	_updateCubies(turn) {
		for(let el of this.shadowRoot.querySelectorAll('[data-p]')) {
			// read previous p and o
			let {p, o} = el.dataset;

			// set new p and o
			el.dataset.p = turn2p[turn][p];
			el.dataset.o = (o + turn2oAdd[turn][p]) % 3;
		}
	}
	
	connectedCallback() {
		this.shadowRoot.querySelector('.cube').addEventListener('transitionend', _ => this._turnAnimationWindUp());
	}
	disconnectedCallback() {
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



function runSoon(cb) {
	requestAnimationFrame(_ =>
		requestAnimationFrame(_ =>
			cb()
		)
	);
}

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
