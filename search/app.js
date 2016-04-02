'use strict';
const CubeState = require('./cubestate');
const search = require('./search');

(function(req, res) {
	let p = [1,4,3,6,5,2,7,0];
	let o = [1,0,1,1,2,1,0,0];
	let state = new CubeState(p, o);
	console.log(state.normalize());
	console.log(state.toString());
	let solution = search(state);
	//req.send(solution);
	console.log(solution);
})()
