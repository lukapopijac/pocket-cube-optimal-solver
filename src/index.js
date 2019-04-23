import solve from './solve.js';
import CubeUnfolded from './components/cube-unfolded/cube-unfolded.js';


let cubeUnfolded = new CubeUnfolded({
	onStickerClick() {
		setSolution(null);
	},
	getSelectedColor() {
		return document.querySelector('.color-pick.selected').getAttribute('data-v');
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

// set click handler on button 'solve'
document.querySelector('.button.solve').addEventListener('click', function(evt) {
	// if(validateState()) {
	// 	setSolution('Impossible state!', true);
	// 	return;
	// }

	setSolution(null);

	let {p, o} = cubeUnfolded.getStickers();

	let stickers = cubeUnfolded.getStickers2();

	console.log(stickers);

	let {p: p2, o: o2} = getPandO(stickers);

	console.log(p2, o2);

	let data = solve(p, o);
	setSolution(formulateSolution(data), false, isSolved(data));
});


function getPandO(stickers) {
	let cubies = stickers.join('').match(/.{3}/g);

	console.log('cuies', cubies);

	let validCubies = [
		['urf', 'fur', 'rfu'],
		['ufl', 'luf', 'flu'],
		['ubr', 'rub', 'bru'],
		['ulb', 'bul', 'lbu'],
		['dfr', 'rdf', 'frd'],
		['dlf', 'fdl', 'lfd'],
		['drb', 'bdr', 'rbd'],
		['dbl', 'ldb', 'bld']
	];

	// let P = [[], [], [], [], [], [], [], []];
	// let O = [[], [], [], [], [], [], [], []];
	let PO = [[], [], [], [], [], [], [], []];
	for(let k=0; k<8; k++) {
		let re = RegExp(cubies[k]);
		for(let i=0; i<8; i++) {
			for(let j=0; j<3; j++) {
				if(re.test(validCubies[i][j])) {
					// P[k].push(i);
					// O[k].push(j);
					PO[k].push({p: i, o: j});
				}
			}
		}
	}

	// validation
	for(let i=0; i<8; i++) if(PO[i].length != 1) return null;

	let p = [];
	let o = [];
	for(let i=0; i<8; i++) {
		p[i] = PO[i][0].p;
		o[i] = PO[i][0].o;
	}

	return {p, o};
}



function validateState() {
	var s = stickers.map(x => ({
		p: +x.getAttribute('data-p'),
		o: +x.getAttribute('data-o'),
		v: +x.getAttribute('data-v')
	}));
	
	// check if any color exists on two stickers on the same cubie
	var t = s.reduce((a,x) => {
		if(!a || x.v&a[x.p]) return null;
		a[x.p] += x.v;
		return a;
	}, [0,0,0,0,0,0,0,0]);
	if(t==null) return true;
	
	// check if two opposite colors exist on the same cubie (yellow-white=36, green-blue=17, red-orange=10)
	if(t.some(x => (x&36)==36 || (x&17)==17 || (x&10)==10)) return true;
	
	// check if any color exists on more than 4 stickers
	t = s.filter(x => x.v!=0)
		.map(x => x.v<8 ? x.v>>1 : (x.v>>4)+3)   // map {1,2,4,8,16,32} to {0,1,2,3,4,5}
		.reduce((a,x) => {
			if(!a || a[x]==4) return null;
			a[x]++;
			return a;
		}, [0,0,0,0,0,0]);
	if(t==null) return true;
	
	// TODO: check if any cubie is illegal (e.g. swapping two colors on it makes cubie illegal)
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
