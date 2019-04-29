import solve from './solve.js';
import CubeUnfolded from './components/cube-unfolded/cube-unfolded.js';
import {Controls} from './components/controls/controls.js';

let cubeUnfolded = new CubeUnfolded({
	onStickerClick() {
		setSolution(null);
	},
	getSelectedColor() {
		return controls.getSelectedColor();
	}
});


let controls = new Controls();

controls.addEventListener('click-reset', _ => {
	setSolution(null);
	cubeUnfolded.setStickersToSolved();
});
controls.addEventListener('click-empty', _ => {
	setSolution(null);
	cubeUnfolded.setStickersToEmpty();
});
controls.addEventListener('click-shuffle', _ => {
	setSolution(null);
	let p = getRadnomP();
	let o = getRandomO();
	let stickers = po2stickers(p, o);
	cubeUnfolded.setStickers(stickers);
});
controls.addEventListener('click-solve', _ => {
	let stickers = cubeUnfolded.getStickers();
	let po = stickers2po(stickers);
	if(!po) {
		setSolution('Invalid or ambiguous state!');
		return;
	}
	let data = solve(po.p, po.o);
	setSolution(formulateSolution(data), false, isSolved(data));
});




document.body.insertBefore(controls, document.body.firstElementChild);
document.body.insertBefore(cubeUnfolded.element, document.body.firstElementChild);




function getRadnomP() {
	let p = [0, 1, 2, 3, 4, 5, 6, 7];
	for(let i=p.length-1; i>0; i--) {
		let j = Math.random()*(i+1) | 0;
		let b = p[i];
		p[i] = p[j];
		p[j] = b;
	}
	return p;
}

function getRandomO() {
	let o = [];
	let s = 0;
	for(let i=0; i<7; i++) {
		let r = Math.random()*3 | 0;
		o[i] = r;
		s += r;
	}
	o[7] = (30 - s) % 3;
	return o;
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


function isSolved(data) {
	return data.solution.length == 0;
}

function formulateSolution(data) {
	return data.normalize
		.concat(data.solution)
		.map(x => x[1]=='1' ? x[0] : x[1]=='3' ? x[0]+"'" : x)
		.join(' ');
}

function setSolution(text, isError, isSolved) {
	var solRow = document.querySelector('.solution-row');
	
	solRow.classList[text == null ? 'add' : 'remove']('hidden');
	solRow.classList[isError      ? 'add' : 'remove']('error');
	solRow.classList[isSolved     ? 'add' : 'remove']('solved');
	
	solRow.querySelector('.solution').textContent = isSolved ? 'Solved!' : text;
}
