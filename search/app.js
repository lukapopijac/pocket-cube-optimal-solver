const cube = {
	State: require('./cubestate'),
	solve: require('./search')
};

function(req, res) {
	let p = [1,4,3,6,5,2,7,0];
	let o = [1,0,1,1,2,1,0,0];
	let state = new cube.State(p, o);
	let solution = cube.solve(state);
	req.send(solution);
}
