import solve from './solve.js';
import CubeUnfolded from './components/cube-unfolded/cube-unfolded.js';


let v2val = v => '.lb-d---f-------r---------------u'[v];
let val2v = val => ({'.': 0, 'l': 1, 'b': 2, 'd': 4, 'f': 8, 'r': 16, 'u': 32}[val]);


let cubeUnfolded = new CubeUnfolded({
	onStickerClick() {
		setSolution(null);
	},
	getSelectedColor() {
		let v = document.querySelector('.color-pick.selected').getAttribute('data-v');
		return v2val(v);
	}
});


document.body.insertBefore(cubeUnfolded.element, document.body.firstElementChild);


var colorPicks = Array.from(document.querySelectorAll('.color-pick'));


// set click handler on each colorPick
colorPicks.forEach(function(el) {
	el.addEventListener('click', function(evt) {
		document.querySelector('.color-pick.selected').classList.remove('selected');
		evt.target.classList.add('selected');
	});
});

// set click handler on button 'reset'
document.querySelector('.button.reset').addEventListener('click', function(evt) {
	setSolution(null);
	cubeUnfolded.setToSolvedStickers();
});

// set click handler on button 'empty'
document.querySelector('.button.empty').addEventListener('click', function(evt) {
	setSolution(null);
	cubeUnfolded.emptyStickers();
});


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

document.querySelector('.button.shuffle').addEventListener('click', function(evt) {
	setSolution(null);
	let p = getRadnomP();
	let o = getRandomO();
	let stickers = po2stickers(p, o);
	cubeUnfolded.setStickers(stickers);
});


// set click handler on button 'solve'
document.querySelector('.button.solve').addEventListener('click', function(evt) {
	let stickers = cubeUnfolded.getStickers();
	let po = stickers2po(stickers);
	if(!po) {
		setSolution('Invalid or ambiguous state!');
		return;
	}
	let data = solve(po.p, po.o);
	setSolution(formulateSolution(data), false, isSolved(data));
});


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

	// validation
	for(let po of PO) if(po.length != 1) return null;

	let p = PO.map(x => x[0].p);
	let o = PO.map(x => x[0].o);
	return {p, o};
}


function isSolved(data) {
	return data.solution.length==0;
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
