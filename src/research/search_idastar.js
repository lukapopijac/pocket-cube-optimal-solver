import heuristics from '../heuristics.js';
import SearchState from '../searchstate';

function cubeSearchIDAstar(startState) {
	let startNode = new SearchState(startState);
	let maxDepth = heuristics(startState);
	while(true) {
		let t = search(startNode, 0, maxDepth);
		if(typeof t != 'number') return t;  // success!
		maxDepth = t;
	}
}

function search(node, depth, maxDepth) {
	let f = depth + heuristics(node.state);
	if(f > maxDepth) return f;
	if(node.isGoal()) return node.getMoves();
	let min = 100;
	let successors = node.expand();
	for(var i=0; i<successors.length; i++) {
		let t = search(successors[i], depth+1, maxDepth);
		if(typeof t != 'number') return t;  // success!
		if(t<min) min = t;
	}
	return min;
}

module.exports = cubeSearchIDAstar;
