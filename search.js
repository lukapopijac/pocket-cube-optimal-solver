var State = require('./state2');
var PriorityQueue = require('./priorityqueue');

function searchID(startNode) { // iterative deepening search
	for(var i=0; i<=11; i++) { 
		var solution = searchDFS(startNode, 0, i);
		if(solution) return solution;
	}
	return null;
}

function searchDFS(node, depth, maxdepth) {
	if(isGoal(node)) return node;
	if(depth == maxdepth) return null;
	var successors = expand(node);
	for(var i=0; i<successors.length; ++i) {
		var succ = successors[i];
		var f = depth + 1 + heuristics(succ);
		if(f <= maxdepth) {
			var res = searchDFS(succ, depth+1, maxdepth);
			if(res) return res;
		}
	}
	return null;
}



function searchBFS(startNode, startDepth, maxdepth) {	
	q.push([startNode, startDepth], 0);
	while(!q.isEmpty()) {
		var nodeDepth = q.pop();
		var node = nodeDepth[0];
		var depth = nodeDepth[1];
		
		if(isGoal(node)) return node;
		var successors = expand(node);
		for(var i=0; i<successors.length; ++i) {
			var succ = successors[i];
			var f = depth + 1 + heuristics(succ);
			if(f <= maxdepth) q.push([succ, depth+1], depth+1);
		}
	}
	return null;
}


var q;
function searchAstar(startNode, startDepth, maxdepth) {	
	q.push([startNode, startDepth], 0);
	while(!q.isEmpty()) {
		var nodeDepth = q.pop();
		var node = nodeDepth[0];
		var depth = nodeDepth[1];
		
		if(isGoal(node)) return node;
		var successors = expand(node);
		for(var i=0; i<successors.length; ++i) {
			var succ = successors[i];
			var f = depth + 1 + heuristics(succ);
			if(f <= maxdepth) q.push([succ, depth+1], f);
		}
	}
	return null;
}



function isGoal(state) {
	return state.isSolved();
}


function expand(state) {
	expanded++;
	var moves = [];
	var lastSide = state.lastMove && state.lastMove[0];
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
	//var startState = new State()
	//	.move('U1')
	//	.move('F2')
	//	.move('R1')
	//	.move('F3')
	//	.move('R2')
	//	.move('U1')
	//	.move('R3')
	//	.move('U2')
	//	.move('R1')
	//	.move('F2')
	
	
	//var startState = new State().moves("R' F' R U2 R' U2 F' R' U R' F' U2 R'");
	//var startState = new State().moves("R' F' R' U2 R U' F2 U' R2 U2 F' R2 U");
	var startState = new State().moves("U R F' R' F' U' R' U R2 F2 R F2 R'");
	//var startState = new State().moves("U' F2 R U F' R U F R U2 R2 U' F'");
	//var startState = new State().moves("U2 R2 F2 U' R' F2 U R U' R' F R F");
	
	
	//console.log('start state', startState);
	
	startState = startState.normalize()
		.move('x2')
		.move('x2')
	
	startState.prevState = null;
	startState.lastMove = null;
	
	//console.log('normalized state', startState);

	q = new PriorityQueue(11);
	var solution = searchAstar(startState, 0, 11);
	var solution = searchID(startState);
	q = new PriorityQueue(11);
	var solution = searchBFS(startState, 0, 11);

	var n = 1;


	expanded = 0;
	console.time('ID DFS');
	for(var j=0; j<n; j++) {
		var solution = searchID(startState);
	}
	console.timeEnd('ID DFS');
	console.log('expanded', expanded);
	if(solution) console.log('steps', movesToString(solution));
	console.log('---------');
	

	
	expanded = 0;
	console.time('A*');
	for(var j=0; j<n; j++) {
		q = new PriorityQueue(11);
		var solution = searchAstar(startState, 0, 11);
	}
	console.timeEnd('A*');
	console.log('expanded', expanded);
	if(solution) console.log('steps', movesToString(solution));
	console.log('---------');

	
	
	
	expanded = 0;
	console.time('BFS');
	for(var j=0; j<n; j++) {
		q = new PriorityQueue(11);
		var solution = searchBFS(startState, 0, 11);
	}
	console.timeEnd('BFS');
	console.log('expanded', expanded);
	if(solution) console.log('steps', movesToString(solution));
	console.log('---------');
	
	
	
}

// [ 'U1', 'F1', 'R3', 'U3', 'F1', 'U3', 'F1', 'U2', 'F3', 'R2' ]
var expanded = 0;
main();
