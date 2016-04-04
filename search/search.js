'use strict';
const CubeState = require('./cubestate');
const patternDB = require('./patterndatabase').getTable('hash5');
const SearchState = require('./searchstate');
SearchState.setPatternDatabase(patternDB);

function cubeSearch(startState) {
	let startNode = new SearchState(startState);
	let maxDepth = startNode.heuristics();
	while(maxDepth<=11) {  // 11 moves is the worst case solution
		let t = search(startNode, 0, maxDepth);
		if(isNaN(t)) return t;  // success!
		maxDepth++;
	}
	return null;
}

function search(node, depth, maxDepth) {
	let h = node.heuristics();
	if(depth + h > maxDepth) return h;
	if(node.isGoal()) return node.getMoves();
	let successors = node.expand();
    for(var i=0; i<successors.length; i++) {
		let t = search(successors[i], depth+1, maxDepth);
		if(isNaN(t)) return t;  // success!
		if(t-1>h) {
			h = t-1;
			// don't examine other successors if we can already 
			// conclude that the current node can be pruned
			if(depth+h>maxDepth) return h;
		}
	}
	return h;
}


function generateRandomState() {
	var legalMoves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3'];
	var moves = [];
	for(var i=0; i<20; i++) {
		moves.push(legalMoves[Math.random()*9|0]);
	}
	var state = CubeState.generateState(moves);
	state.normalize();
	return state;
}


function main() {
	//let startState = CubeState.generateState("U R U' F R F2");
	//let startState = CubeState.generateState("F' U F U R2 U F' U' F U' R2");
	let startState = CubeState.generateState("U R U' R2 U' R' F' U F2 R F'");
	//let startState = CubeState.generateState("U R F2 U R F2 R U F' R");
	//let startState = CubeState.generateState("U3 R2 F1 U1 F1 R3");
	
	startState.normalize();
	
	cubeSearch(startState);
	console.log('----------------------------------------');
	
	var n = 1;
	console.time('search');
	var solution;
	for(var j=0; j<n; j++) {
		solution = cubeSearch(startState);
	}
	console.timeEnd('search');
	console.log('steps', solution);
	console.log('----------------------------------------');
}

module.exports = cubeSearch;
