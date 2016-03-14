'use strict';
var assert = require('assert');

function compareArrays(a1, a2) {
	if(a1.length !== a2.length) return false;
	return a1.every((x,i) => x===a2[i]);
}

describe('filetable.js', function() {
	var fileTable = require('../filetable');

	function compareMaps(map1, map2) {
		if(map1.size !== map2.size) return false;
		return [...map1].every(x => x[1] === map2.get(x[0]));
	}
	
	
	it('Map object', function() {
		let n = 1000;
		let map_in = new Map();
		for(let i=0; i<n; i++) map_in.set((1+Math.sin(i))*1000000|0, (1+Math.cos(i))*6|0);
		
		fileTable.toFile('test/map-test.gz', map_in);
		let map_out = fileTable.fromFile('test/map-test.gz', 'Map');
		
		assert(map_out instanceof Map);
		assert(compareMaps(map_in, map_out));
	});
	
	it('Uint8Array', function() {
		let n = 1000;
		let arr_in = new Uint8Array(n);
		for(let i=0; i<n; i++) arr_in[i] = (1+Math.cos(i))*100 | 0;
		
		fileTable.toFile('test/uint8-test.gz', arr_in);
		let arr_out = fileTable.fromFile('test/uint8-test.gz', 'Uint8Array');
		
		assert(arr_out instanceof Uint8Array);
		assert(compareArrays(arr_in, arr_out));
	});
	
	it('Int32Array', function() {
		let n = 1000;
		let arr_in = new Int32Array(n);
		for(let i=0; i<n; i++) arr_in[i] = Math.cos(i)*2e9 | 0;
		
		fileTable.toFile('test/int32-test.gz', arr_in);
		let arr_out = fileTable.fromFile('test/int32-test.gz', 'Int32Array');
		
		assert(arr_out instanceof Int32Array);
		assert(compareArrays(arr_in, arr_out));
	});

});

describe('state3.js', function() {
	const State = require('../state3');
	let state, moves;
	let cmp = compareArrays;
	
	it('state normalization', function() {
		state = new State();
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, []));
		
		state = new State([0,1,2,3,4,5,6,7], [0,0,0,0,0,0,0,0]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, []));
		
		state = new State([3,0,5,4,2,1,6,7], [0,1,1,1,1,2,0,0]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, []));
		
		state = new State([2,0,1,6,4,7,3,5], [2,2,2,0,2,0,1,0]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['y1']));
		
		state = new State([6,7,1,3,4,0,5,2], [0,0,0,2,1,0,2,1]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['x2']));
		
		state = new State([5,2,7,6,1,0,3,4], [0,2,0,0,1,1,0,2]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['z2']));
		
		state = new State([7,6,5,2,3,4,0,1], [1,0,0,2,0,2,1,0]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['x2', 'z1']) || cmp(moves, ['y2', 'z3']) || cmp(moves, ['z1', 'y2']));
		
		state = new State([1,2,7,3,5,0,4,6], [0,2,1,2,0,1,0,0]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['x1', 'y3']) || cmp(moves, ['y3', 'z3']) || cmp(moves, ['z3', 'x1']));
		
		state = new State([5,1,7,3,6,4,0,2], [0,0,2,1,0,0,1,2]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['x1', 'z1']) || cmp(moves, ['y3', 'x1']) || cmp(moves, ['z1', 'y3']));
		
		state = new State([2,7,3,4,6,0,5,1], [0,2,1,0,0,1,1,1]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['x1', 'z3']) || cmp(moves, ['y1', 'x1']) || cmp(moves, ['z3', 'y1']));
		
		state = new State([2,4,1,0,6,5,7,3], [0,0,1,2,1,1,2,2]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['x1', 'y2']) || cmp(moves, ['y2', 'x3']) || cmp(moves, ['z2', 'x1']));
		
		state = new State([2,0,5,3,7,4,6,1], [2,0,1,1,1,0,1,0]);
		moves = State.getNormalizationMoves(state);
		assert(cmp(moves, ['x3', 'y3']) || cmp(moves, ['y3', 'z1']) || cmp(moves, ['z1', 'x3']));
	});

});
