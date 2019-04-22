import CubeState from './search/cubestate.js'
import search from './search/search.js';

export default function(per, ori) {
	// let validateMessage = validate(req);
	// if(validateMessage) return validateMessage;

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
	let solution = search(state);
	return {normalize, solution};
};

// function validate(req) {
// 	let p = req.query.p ? req.query.p.split('') : '';
// 	if(	p.length != 8 ||
// 		p.some(x => isNaN(x) || x>7) ||
// 		p.reduce((a,x) => a+(1<<x), 0) != 0b11111111
// 	) return 'Parameter `p` invalid';
	
// 	let o = req.query.o ? req.query.o.split('') : '';
// 	if(	o.length != 8 ||
// 		o.some(x => isNaN(x) || x>2) ||
// 		o.reduce((a,x) => +x+a, 0) % 3 != 0
// 	) return 'Parameter `o` invalid';	
// }
