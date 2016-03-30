'use strict';
const State = require('./state');
const SearchState = require('./searchstate');

function searchIterativeDeepening(startState) {
	let startNode = new SearchState(startState);
	let maxdepth = startNode.heuristics();
	while(maxdepth<=11) {
		//console.log(maxdepth);
		let t = search(startNode, 0, maxdepth);
		if(isNaN(t)) return t;  // success!
		maxdepth++;
	}
	return null;
}

let expanded = 0;
function search(node, depth, maxdepth) {
	let h = node.heuristics();
	if(depth + h > maxdepth) return h;
	if(node.isGoal()) return node;
	let successors = node.expand();
	expanded++;
    for(var i=0; i<successors.length; i++) {
		let t = search(successors[i], depth+1, maxdepth);
		if(isNaN(t)) return t;  // success!
		if(t-1>h) {
			h = t-1;
			if(depth+h>maxdepth) return h;
		}
	}
	return h;
}


function movesToString(state) {
	var moves = [];
	while(state.prevSearchState) {
		moves.push(state.lastMove);
		state = state.prevSearchState;
	}
	return moves.reverse().join(' ');
}


function generateRandomState() {
	var legalMoves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3'];
	var moves = [];
	for(var i=0; i<20; i++) {
		moves.push(legalMoves[Math.random()*9|0]);
	}
	var state = State.generateState(moves);
	state.normalize();
	return state;
}

function main2() {
	for(var i=0; i<1000; i++) {
		var state = generateRandomState();
		
		var moves1// = movesToString(searchIDAstar(state));
		var moves2// = movesToString(searchIDAstar3(state));
		if(moves1 != moves2) {
			console.log(i);
			console.log(moves1);
			console.log(moves2);			
			console.log('-----------');
		}
	}
}

function main() {
	//let startState = State.generateState("U R U' F R F2");
	let startState = State.generateState("F' U F U R2 U F' U' F U' R2");
	//let startState = State.generateState("U R U' R2 U' R' F' U F2 R F'");
	//let startState = State.generateState("U R F2 U R F2 R U F' R");
	//let startState = State.generateState("U3 R2 F1 U1 F1 R3");
	
	startState.normalize();
	
	searchIterativeDeepening(startState);
	console.log('----------------------------------------');
	
	var n = 100;
	expanded = 0;
	console.time('search');
	var solution;
	for(var j=0; j<n; j++) {
		solution = searchIterativeDeepening(startState);
	}
	console.timeEnd('search');
	console.log('expanded', expanded/n);
	console.log('steps', movesToString(solution));
	console.log('----------------------------------------');
}

main();
