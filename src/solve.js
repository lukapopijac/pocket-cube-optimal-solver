import CubeState from './cubestate.js'
import search from './search.js';
import {removeCubeRotations, addRandomCubeRotations} from './moves-editor.js';

export default function(per, ori) {
	let [p2, p1, p0, o] = [0, 0, 0, 0];
	for(let i=0; i<8; i++) {
		let p = per[i];
		p0 += (p & 1) << i     // take 1. bit from right and put it to i-th position
		p1 += (p>>1 & 1) << i; // take 2. bit from right and put it to i-th position
		p2 += p >> 2 << i;     // take 3. bit from right and put it to i-th position
		let oi = ori[i];
		o += (oi<2 ? oi : 3) << 2*i // fix 2->0b11 and put it to 2*i-th position
	}

	let state = new CubeState(p2, p1, p0, o);
	let normalize = state.normalize();

	console.time('search');
	let solutionAfterNormalize = search(state);
	console.timeEnd('search');

	let solution = normalize.concat(solutionAfterNormalize);
	solution = addRandomCubeRotations(solution, 4);
	solution = removeCubeRotations(solution);

	return solution;
};
