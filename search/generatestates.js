'use strict';
const State = require('./state');
const SearchState = require('./searchstate');
const fileTable = require('./filetable');

let table = new Map();

function generateStates(node, depth, maxDepth) {
	var key = generateKey(node.state);
	if(!table.has(key) || depth<table.get(key)) table.set(key, depth);
	else return null;  // don't explore this node as it has already been explored
	if(depth == maxDepth) return null;
	let successors = node.expand();
	for(let i=0; i<successors.length; ++i) generateStates(successors[i], depth+1, maxDepth);
	return null;
}

function generateKey(state) {
	return state.p0&63 | (state.p1&63)<<6 | (state.p2&63)<<12 | (state.o&4095)<<18;
}


function main() {
	let maxDepth = 11;
	console.time('generate states');
	generateStates(new SearchState(new State()), 0, maxDepth);
	console.timeEnd('generate states');
	console.log(table.size);
	
	console.time('save to file');
	let n = ('0' + maxDepth).slice(-2);
	fileTable.toFile('tables/table' + n + '.gz', table);
	console.timeEnd('save to file');
}

main();
