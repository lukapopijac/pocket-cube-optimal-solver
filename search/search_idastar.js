'use strict';
const CubeState = require('./cubestate');
const patternDB = require('./patterndatabase').getTable('hash5');
const SearchState = require('./searchstate');
SearchState.setPatternDatabase(patternDB);

function cubeSearchIDAstar(startState) {
	let startNode = new SearchState(startState);
	let maxDepth = startNode.heuristics();
	while(true) {
		let t = search(startNode, 0, maxDepth);
		if(typeof t != 'number') return t;  // success!
		maxDepth = t;
	}
	return null;
}

function search(node, depth, maxDepth) {
	let f = depth + node.heuristics();
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
