'use strict';

const State = require('./state2');


function searchIDAstar(startNode) { // iterative deepening A* search
	var maxdepth = heuristics(startNode);
	while(true) {
		var t = search(startNode, 0, maxdepth);
		if(!Number.isInteger(t)) return t;  // success!
		maxdepth = t;
	}
	return t;
}

function search(node, depth, maxdepth) {
	let f = depth + heuristics(node);
	if(f > maxdepth) return f;
	if(isGoal(node)) return node;
	let min = 100;
	let successors = expand(node);
	for(let i=0; i<successors.length; ++i) {
		let t = search(successors[i], depth+1, maxdepth);
		if(!Number.isInteger(t)) return t;  // success!
		if(t<min) min = t;
	}
	return min;
}





function isGoal(state) {
	return state.isSolved();
}




function expand(state) {
	expanded++;
	let moves;
	let lastSide = state.lastMove && state.lastMove[0];
	switch(lastSide) {
		case 'U': moves = ['F1', 'F2', 'F3', 'R1', 'R2', 'R3']; break;
		case 'F': moves = ['U1', 'U2', 'U3', 'R1', 'R2', 'R3']; break;
		case 'R': moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3']; break;
		default: moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3'];
	}
	return moves.map(x => state.move(x));
}



var fs = require('fs');
var zlib = require('zlib');

var buf = fs.readFileSync('hashtable3.gz');
var hashTable = JSON.parse(zlib.inflateSync(buf));

function hash2(p, o) {
	//avg 6.926641268004115    len 124416 124416
	return (
		(((p[0]&1) + (p[1]&6))<<6) + 
		(((p[2]&2) + (p[3]&5))<<3) + 
		((p[4]&3) + (p[5]&4))
	  ) * 243 + 
	  (o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[5]);
}

function hash3(p, o) {
	//avg 7.613141932441701    len 373248 373248
	return (
			(((p[0]&1) + (p[1]&6))<<6) + 
			(((p[2]&2) + (p[3]&5))<<3) + 
			((p[4]&3) + (p[5]&4))
		) * 729 + 
		(o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[4] + 243*o[5]);
}

function heuristics(state) {
	return hashTable[hash3(state.p, state.o)];
}

function movesToString(state) {
	var moves = [];
	while(state.prevState) {
		moves.push(state.lastMove);
		state = state.prevState;
	}
	return moves.reverse();
}

function main() {
	//var startState = new State().moves("R' F' R U2 R' U2 F' R' U R' F' U2 R'");
	//var startState = new State().moves("R' F' R' U2 R U' F2 U' R2 U2 F' R2 U");
	//var startState = new State().moves("U R F' R' F' U' R' U R2 F2 R F2 R'");
	//var startState = new State().moves("U' F2 R U F' R U F R U2 R2 U' F'");
	//var startState = new State().moves("U2 R2 F2 U' R' F2 U R U' R' F R F");
	//var startState = new State().moves("F U' F' U' R2 U' R2 U' F2 U2 F2 R2 F' R U");
	//var startState = new State().moves("U R' U R2 U2 F R U2 F U' R U2 F' U F");
	//var startState = new State().moves("U2 R2 U2 R2 F U2 F' U' R F' R2 U' F R2 U'");
	//var startState = new State().moves("R2 U' R' F' U2 F U2 R' F2 R2 F R' U2 F' R'");
	var startState = new State().moves("R U' R F' U F R' F2 U' F U F' U' F' U'");
	
	searchIDAstar(startState)
	//console.log('start state', startState);
	
	startState = startState.normalize();
	startState.prevState = null;
	startState.lastMove = null;
	
	//console.log('normalized state', startState);
	
	var n = 1000;
	
	
	// ---------- IDA*
	expanded = 0;
	console.time('IDA*');
	for(var j=0; j<n; j++) {
		var solution = searchIDAstar(startState);
	}
	console.timeEnd('IDA*');
	console.log('expanded', expanded/n);
	if(solution) console.log('steps', movesToString(solution));
	console.log('---------');

}

var expanded = 0;
main();
