'use strict';
const State = require('./state4');
const SearchState = require('./searchstate');
const filetable = require('./filetable');

let table = new Map();

function generateStates(node, depth, maxdepth) {
	var key = generateKey(node.state);
	if(!table.has(key) || depth<table.get(key)) table.set(key, depth);
	else return null;  // don't explore this node as it has already been explored
	if(depth == maxdepth) return null;
	let successors = node.expand();
	for(let i=0; i<successors.length; ++i) generateStates(successors[i], depth+1, maxdepth);
	return null;
}


function generateKey(state) {
	let ps = [0,0,0,0,0,0,0];
	for(let k=0; k<3; k++) {
		let pp = state['p' + k];
		for(let i=0; i<7; i++) {
			let x = pp&1;
			ps[i] += x*(1<<k);
			pp>>=1;
		}
	}
	
	let os = [0,0,0,0,0,0];
	let oo = state.o;
	for(let i=0; i<6; i++) {
		let x = oo&0b11;
		if(x==3) x=2;
		os[i] = x<3 ? x : 2;
		oo>>=2;
	}
	
	let b = '';
	for(let j=0; j<7; j++) b += ps[j];
	for(let j=0; j<6; j++) b += os[j];
	return b;
}

function main() {
	console.time('generate states');
	generateStates(new SearchState(new State()), 0, 8);
	console.timeEnd('generate states');
	console.log(table.size);
	
	console.time('save to file');
	filetable.toFile('tables/table08_2.gz', table);
	console.timeEnd('save to file');
}

main();
