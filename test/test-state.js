'use strict';
var assert = require('assert');

describe('state.js', function() {
	const State = require('../state');
	let state, moves;
	let cmp = function(a1, a2) {
		if(a1.length !== a2.length) return false;
		return a1.every((x,i) => x===a2[i]);
	};
	
	it('state normalization', function() {
		state = new State();
		moves = state.getNormalizationMoves();
		assert(cmp(moves, []));
		
		state = new State(0b11110000, 0b11001100, 0b10101010, 0b0000000000000000);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, []));
		
		state = new State(0b11001100, 0b11010001, 0b10100101, 0b0000110101010100);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, []));
		
		state = new State(0b10111000, 0b01101001, 0b11100100, 0b0001001100111111);		
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['y1']));
		
		state = new State(0b01010011, 0b10001011, 0b01001110, 0b0111000111000000);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['x2']));
		
		state = new State(0b10001101, 0b01001110, 0b01010101, 0b1100010100001100);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['z2']));
		
		state = new State(0b00100111, 0b00011011, 0b10010101, 0b0001110011000001);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['x2', 'z1']) || cmp(moves, ['y2', 'z3']) || cmp(moves, ['z1', 'y2']));
		
		state = new State(0b11010100, 0b10001110, 0b00011101, 0b0000010011011100);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['x1', 'y3']) || cmp(moves, ['y3', 'z3']) || cmp(moves, ['z3', 'x1']));
		
		state = new State(0b00110101, 0b10011100, 0b00001111, 0b1101000001110000);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['x1', 'z1']) || cmp(moves, ['y3', 'x1']) || cmp(moves, ['z1', 'y3']));
		
		state = new State(0b01011010, 0b00010111, 0b11000110, 0b0101010000011100);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['x1', 'z3']) || cmp(moves, ['y1', 'x1']) || cmp(moves, ['z3', 'y1']));
		
		state = new State(0b01110010, 0b11010001, 0b11100100, 0b1111010111010000);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['x1', 'y2']) || cmp(moves, ['y2', 'x3']) || cmp(moves, ['z2', 'x1']));
		
		state = new State(0b01110100, 0b01011001, 0b10011100, 0b0001000101010011);
		moves = state.getNormalizationMoves();
		assert(cmp(moves, ['x3', 'y3']) || cmp(moves, ['y3', 'z1']) || cmp(moves, ['z1', 'x3']));
	});

});
