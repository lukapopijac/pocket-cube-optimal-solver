import heuristics from './heuristics.js';
import SearchState from './searchstate.js';
SearchState.setPatternDatabase(heuristics);

export default function cubeSearch(startState) {
	let startNode = new SearchState(startState);
	let maxDepth = startNode.heuristics();
	while(maxDepth<=11) {  // 11 moves is the worst case solution
		let t = search(startNode, 0, maxDepth);
		if(typeof t != 'number') return t;  // success!
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
		if(typeof t != 'number') return t;  // success!
		if(t-1>h) {
			h = t-1;
			// don't examine other successors if we can already 
			// conclude that the current node can be pruned
			if(depth+h>maxDepth) return h;
		}
	}
	return h;
}
