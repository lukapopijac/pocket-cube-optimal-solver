// This file contains helper functions for alteration of moves.


const b2idx = {'x1': 0, 'x2': 1, 'x3': 2, 'y1': 3, 'y2': 4, 'y3': 5, 'z1': 6, 'z2': 7, 'z3': 8};

const rt1 = {
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
	'x': 'UFDB',  // 'U' goes to 'F', goes to 'D', goes to 'B'
	'y': 'FRBL',
	'z': 'ULDR'
};



/**
Remove the move on index `idx`. This is posible only if the move is only a cube
rotation move (type 'x', 'y', or 'z'), otherwise function returns `null`. Other
moves will be changed so the final result (to the cube rotation) is preserved.
*/
export function removeCubeRotationAt(moves, idx) {
	let a = moves[idx];
	if(!rt1[a]) return null;

	moves = moves.slice();
	moves.splice(idx, 1);

	for(let i=idx; i<moves.length; i++) {
		moves[i] = getReplace(a, moves[i]);
	}

	return moves.filter(x=>x); // remove nulls
}


/**
If move `a` is being removed and move `b` is somewhere after move `a`,
function returns the move that `b` needs to be replaced with.
*/
function getReplace(a, b) {
	// check if `b` is a cube rotation move
	let i = b2idx[b];
	if(i >= 0) return rt1[a][i];

	// check if `b` is a regular face move that needs to be updated
	let t = rt2[a[0]];
	let k = t.indexOf(b[0]);
	if(k > -1) return t[(k + (+a[1])) % 4] + b[1];

	// `b` is not influenced by `a`
	return b;
}



/**
If there is a face move on index `idx`, e.g. 'R1', this function
will replace that move with cotra move 'L1', following by 'x1'.
Does nothing if `moves[idx]` is a cube rotation move.
*/
export function replaceWithContra(moves, idx) {
	if(rt1[moves[idx]]) return moves;  // it's a cube rotation move

}



/**
Returns 2 moves that the given move can be replaced with. (It brings the cube to the same state).
First move out of the two will be a face move, and the second a cube rotation move.
E.g.: for input 'R1', returns ['L1', 'x1'].
*/
function replaceMoves1to2(move) {
	if(rt1[move]) return move;  // it's a cube rotation move
	
	let [face, steps] = move;
	let r = {
		'U': ['D', 'y'],
		'F': ['B', 'z'],
		'R': ['L', 'x'],
		'L': ['R', 'x'],
		'B': ['F', 'z'],
		'D': ['U', 'y']
	}[face];

	r[0] += steps;
	r[1] += 'UFR'.includes(face) ? steps : 4 - steps;

	return r;
}
