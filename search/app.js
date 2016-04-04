'use strict';
const CubeState = require('./cubestate');
const search = require('./search');

(function(req, res) {
	let state = new CubeState(0b01101100, 0b00011101, 0b10100101, 0b0100010111010000);
	console.log(state.toString());
	console.log(state.normalize());
	console.log(state.toString());
	let solution = search(state);
	//req.send(solution);
	console.log(solution);
})();
