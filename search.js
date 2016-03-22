'use strict';
const State = require('./state');
const SearchState = require('./searchstate');

function searchIDAstar(startState) { // iterative deepening A* search
	let startNode = new SearchState(startState);
	let maxdepth = startNode.heuristics();
	while(true) {
		let t = search(startNode, 0, maxdepth);
		if(isNaN(t)) return t;  // success!
		maxdepth = t;
	}
	return null;
}

let expanded = 0;
function search(node, depth, maxdepth) {
	let f = depth + node.heuristics();
	if(f > maxdepth) return f;
	if(node.isGoal()) return node;
	let min = 100;
	let successors = node.expand();
	//successors.sort((a,b) => a.heuristics()-b.heuristics());
	expanded++;
	for(let i=0; i<successors.length; ++i) {
		let t = search(successors[i], depth+1, maxdepth);
		if(isNaN(t)) return t;  // success!
		if(t<min) min = t;
	}
	return min;
}


function movesToString(state) {
	var moves = [];
	while(state.prevSearchState) {
		moves.push(state.lastMove);
		state = state.prevSearchState;
	}
	return moves.reverse();
}

function main() {
	let startState = State.generateState("U R U' R2 U' R' F' U F2 R F'");
	//let startState = State.generateState("U R F2 U R F2 R U F' R");
	
	startState.normalize();
	
	searchIDAstar(startState);
	
	var n = 10;
	// ---------- IDA*
	expanded = 0;
	console.time('IDA*');
	let solution;
	for(var j=0; j<n; j++) {
		solution = searchIDAstar(startState);
	}
	console.timeEnd('IDA*');
	console.log('expanded', expanded/n);
	console.log('steps', movesToString(solution));
	console.log('---------');
}

main();
