'use strict';
const State = require('./state2');
const filetable = require('./filetable');

let table = new Map();

function generateStates(node, depth, maxdepth) {
	var key = generateKey(node);	
	if(!table.has(key) || depth<table.get(key)) table.set(key, depth);
	else return null;  // don't explore this node as it has already been explored
	if(depth == maxdepth) return null;
	let successors = expand(node);
	for(let i=0; i<successors.length; ++i) generateStates(successors[i], depth+1, maxdepth);
	return null;
}

function expand(state) {
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

function generateKey(state) {
	let b = '';
	for(let j=0; j<7; j++) b += state.p[j];
	for(let j=0; j<6; j++) b += state.o[j];
	return b;
}

function main() {
	console.time('generate states');
	generateStates(new State(), 0, 11);
	console.timeEnd('generate states');
	console.log(table.size);
	
	console.time('save to file');
	filetable.toFile('tables/table11.gz', table);
	console.timeEnd('save to file');
}

main();
