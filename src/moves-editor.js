// This file contains helper functions for alteration of moves.


const rt0 = {'x1': 0, 'x2': 1, 'x3': 2, 'y1': 3, 'y2': 4, 'y3': 5, 'z1': 6, 'z2': 7, 'z3': 8};

const rt1 = { // e.g. moves ['x3', 'y2'] can be replaced with 'z2'
	//      x1    x2    x3    y1    y2    y3    z1    z2    z3
	'x1': ['x2', 'x3', null, 'z1', 'z2', 'z3', 'y3', 'y2', 'y1'],
	'x2': ['x3', null, 'x1', 'y3', 'y2', 'y1', 'z3', 'z2', 'z1'],
	'x3': [null, 'x1', 'x2', 'z3', 'z2', 'z1', 'y1', 'y2', 'y3'],
	'y1': ['z3', 'z2', 'z1', 'y2', 'y3', null, 'x1', 'x2', 'x3'],
	'y2': ['x3', 'x2', 'x1', 'y3', null, 'y1', 'z3', 'z2', 'z1'],
	'y3': ['z1', 'z2', 'z3', null, 'y1', 'y2', 'x3', 'x2', 'x1'],
	'z1': ['y1', 'y2', 'y3', 'x3', 'x2', 'x1', 'z2', 'z3', null],
	'z2': ['x3', 'x2', 'x1', 'y3', 'y2', 'y1', 'z3', null, 'z1'],
	'z3': ['y3', 'y2', 'y1', 'x1', 'x2', 'x3', null, 'z1', 'z2']
};

const rt2 = {
	'x': 'UFDB',  // when 'x1' before 'Fn', replace it with 'Dn' (D is 1 postiion right of F)
	'y': 'FRBL',
	'z': 'ULDR'
};

const antiFaces = {     // opposite faces
	'U': 'D', 'D': 'U',
	'F': 'B', 'B': 'F',
	'R': 'L', 'L': 'R'
};

const face2plane = {
	'U': 'y', 'D': 'y',
	'F': 'z', 'B': 'z',
	'R': 'x', 'L': 'x',
};



export function removeCubeRotations(moves) {
	moves = moves.slice();
	for(let i=moves.length; i>=0; i--) {
		moves = removeCubeRotationAt(moves, i);
	}
	return moves;
}

export function addRandomCubeRotations(moves, n) {
	for(let i=0; i<n; i++) {
		moves = replaceWithContra(moves, Math.random() * moves.length | 0);
	}
	return moves;
}



/**
Remove a cube rotation move on index `idx`, otherwise function returns input `moves`.
Subsequent moves will be changed so the final result (to the cube rotation) is preserved.
*/
function removeCubeRotationAt(moves, idx) {
	let a = moves[idx];
	if(!(a in rt0)) return moves;

	moves = moves.slice();
	moves.splice(idx, 1);

	for(let i=idx; i<moves.length; i++) {
		moves[i] = replace2to1(a, moves[i]);
	}

	return moves.filter(x=>x); // remove nulls
}



/**
If there is a face move on index `idx`, e.g. 'R1', this function will replace that move
with cotra move 'L1', following by 'x1'. Final cube state will be preserved.
Does nothing if `moves[idx]` is a cube rotation move.
*/
function replaceWithContra(moves, idx) {
	if(rt1[moves[idx]]) return moves;  // it's a cube rotation move
	moves = moves.slice();
	moves[idx] = replace1to2(moves[idx]);
	return moves.flat();
}



/**
Returns 1 move that the given 2 moves `a` and `b` can be replaced with. (It brings
the cube to the same state).
First move out of the two must be a cube rotation move, there is no input validation.
E.g.: for input ('x1', 'U3'), returns 'F3'.
*/
function replace2to1(a, b) {
	// check if `b` is a cube rotation move
	let i = rt0[b];
	if(i >= 0) return rt1[a][i];

	// check if `b` is a regular face move
	let t = rt2[a[0]];
	let k = t.indexOf(b[0]);
	if(k > -1) return t[(k + (+a[1])) % 4] + b[1];

	// `b` is not influenced by `a`
	return b;
}



/**
Returns 2 moves that the given face move can be replaced with. (It brings the cube to the same state).
If input move is a cube rotation move, function just returns that move.
First move out of the two will be a face move, and the second a cube rotation move.
E.g.: for input 'R1', returns ['L1', 'x1'].
*/
function replace1to2(move) {
	if(move in rt0) return move;  // it's a cube rotation move
	let [face, step] = move;
	let a = antiFaces[face] + step;
	let b = face2plane[face] + ('UFR'.includes(face) ? step : 4 - step);
	return [a, b];
}
