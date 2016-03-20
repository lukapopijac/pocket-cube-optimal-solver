'use strict';
var assert = require('assert');

describe('state3.js', function() {
	const State = require('../state3');
	let state, moves;
	let cmp = function(a1, a2) {
		if(a1.length !== a2.length) return false;
		return a1.every((x,i) => x===a2[i]);
	};
	
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
