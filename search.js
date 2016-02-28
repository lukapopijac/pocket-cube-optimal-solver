function search(node, depth, maxdepth) {
	if(isGoal(node)) return node;
	if(depth == maxdepth) return null;
	var successors = expand(node);
	for(var i=0; i<successors.length; ++i) {
		var succ = successors[i];
		var f = depth + 1 + heuristics(succ);
		if(f <= maxdepth) {
			var res = search(succ, depth+1, maxdepth);
			if(res) return res;
		}
	}
	return null;
}


function isGoal(node) {
	return node.isSolved();
}


function expand(node) {
	expanded++;
	var moves = [];
	switch(node.lastMove[0]) {
		case 'U': moves = ['F1', 'F2', 'F3', 'R1', 'R2', 'R3']; break;
		case 'F': moves = ['U1', 'U2', 'U3', 'R1', 'R2', 'R3']; break;
		case 'R': moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3']; break;
		default: moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3'];
	}
	return moves.map(x => node.generateNextState(x));
}

function heuristics(node) {
	return 0;
}



function main() {
	var startState = new State()
		.generateNextState('U1')
		.generateNextState('F2')
		//.generateNextState('R1')
		//.generateNextState('F3')
		//.generateNextState('U1');
	startState.prevState = null;
	startState.lastMove = '..';
	for(var i=0; i<7; i++) { 
		var solution = search(startState, 0, i);
		if(solution) {
			console.log(i);
			console.log(solution);
			break;
		}
	}
	console.log('end');
	console.log(expanded);
}


var expanded = 0;
main();
