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
			//if(res) return res;
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

function heuristics(state) {
	return 0;
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
	var startState = new State()
		.move('U1')
		.move('F2')
		.move('R1')
		.move('F3')
		.move('R2')
		.move('U1')
		.move('R3')
		.move('U2')
		.move('R1')
		.move('F2')
	
	console.log('start state', startState);
	
	startState = startState.normalize()
		.move('x2')
		.move('x2')
	
	startState.prevState = null;
	startState.lastMove = null;
	
	console.log('normalized state', startState);
	
	console.time('search time');
	var solution = searchID(startState);
	console.timeEnd('search time');
	console.log('expanded', expanded);
	console.log('solution', solution);
	if(solution) console.log('steps', movesToString(solution));
}


var expanded = 0;
main();
