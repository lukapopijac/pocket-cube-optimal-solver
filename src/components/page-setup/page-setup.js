import CubeUnfolded from '../cube-unfolded/cube-unfolded.js';
import '../setup-controls/setup-controls.js';
import '../dialog-message/dialog-message.js';

const template = document.createElement('template');
template.innerHTML = require('./page-setup.html');


export class PageSetup extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		let el_setupControls = this.shadowRoot.querySelector('m-setup-controls');
		this._el_message = this.shadowRoot.querySelector('m-dialog-message');
		let el_cubeUnfolded = new CubeUnfolded();  // create here, so its methods exist right away
		
		this.shadowRoot.querySelector('div').prepend(el_cubeUnfolded);
		
		// prepare cubeUnfolded
		el_cubeUnfolded.getSelectedColor = _ => el_setupControls.selectedColor;

		// prepare controls
		el_setupControls.addEventListener('click-reset', _ => {
			el_cubeUnfolded.setStickersToSolved();
		});
		el_setupControls.addEventListener('click-empty', _ => {
			el_cubeUnfolded.setStickersToEmpty();
		});
		el_setupControls.addEventListener('click-shuffle', _ => {
			let {p, o} = generateRandomPO();
			el_cubeUnfolded.stickerValues = po2stickers(p, o);
		});
		el_setupControls.addEventListener('click-solve', _ => {
			let po = stickers2po(el_cubeUnfolded.stickerValues);
			if(!po) {
				this._el_message.textContent = 'Invalid or ambiguous state!';
				this._el_message.hidden = false;		
			}
			else this.dispatchEvent(new CustomEvent('solve', {detail: po}));
		});
		el_setupControls.addEventListener('pick-color', evt => {
			el_cubeUnfolded.selectedColor = evt.detail;
		});

		// // test for some 11-step solution
		// let el_test = document.createElement('button');
		// el_test.textContent = 'test';
		// el_test.onclick = _ => {
		// 	this.dispatchEvent(new CustomEvent('solve', 
		// 		{
		// 			detail: {
		// 				p: [4,1,2,3,0,5,6,7],
		// 				o: [0,0,0,0,0,0,0,0]
		// 			}
		// 		}
		// 	));
		// }
		// el_setupControls.parentNode.appendChild(el_test);
		// // test end
	}
}

customElements.define('m-page-setup', PageSetup);











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
