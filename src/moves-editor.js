// This file contains helper functions for alteration of moves.


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

// if move `a` is being removed and move `b` is somewhere after move `a`,
// function returns the move that `b` needs to be replaced with.
function getReplace(a, b) {
	// check if `b` is a cube rotation move
	let i = b2idx[b];
	if(i >= 0) return rt1[a][i];

	// check if `b` is a regular side move that needs to update
	let t = rt2[a[0]];
	let k = t.indexOf(b[0]);
	if(k > -1) return t[(k + (+a[1])) % 4] + b[1];

	// `b` is not influenced by `a`
	return b;
}
