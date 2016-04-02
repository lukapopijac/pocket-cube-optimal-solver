'use strict';
var assert = require('assert');

describe('cubestate.js', function() {
	const CubeState = require('../search/cubestate');
	let cubeState, moves;
	
	it('cubeState.getNormalizationMoves()', function() {
		cubeState = new CubeState();
		moves = cubeState.getNormalizationMoves();
		assert.deepEqual(moves, []);
		
		cubeState = new CubeState(0b11110000, 0b11001100, 0b10101010, 0b0000000000000000);
		moves = cubeState.getNormalizationMoves();
		assert.deepEqual(moves, []);
		
		cubeState = new CubeState(0b11001100, 0b11010001, 0b10100101, 0b0000110101010100);
		moves = cubeState.getNormalizationMoves();
		assert.deepEqual(moves, []);
		
		cubeState = new CubeState(0b10111000, 0b01101001, 0b11100100, 0b0001001100111111);		
		moves = cubeState.getNormalizationMoves();
		assert.deepEqual(moves, ['y1']);
		
		cubeState = new CubeState(0b01010011, 0b10001011, 0b01001110, 0b0111000111000000);
		moves = cubeState.getNormalizationMoves();
		assert.deepEqual(moves, ['x2']);
		
		cubeState = new CubeState(0b10001101, 0b01001110, 0b01010101, 0b1100010100001100);
		moves = cubeState.getNormalizationMoves();
		assert.deepEqual(moves, ['z2']);
		
		cubeState = new CubeState(0b00100111, 0b00011011, 0b10010101, 0b0001110011000001);
		moves = cubeState.getNormalizationMoves().join('');
		assert.notEqual(['x2z1', 'y2z3', 'z1y2'].indexOf(moves), -1);
		
		cubeState = new CubeState(0b11010100, 0b10001110, 0b00011101, 0b0000010011011100);
		moves = cubeState.getNormalizationMoves().join('');
		assert.notEqual(['x1y3', 'y3z3', 'z3x1'].indexOf(moves), -1);
		
		cubeState = new CubeState(0b00110101, 0b10011100, 0b00001111, 0b1101000001110000);
		moves = cubeState.getNormalizationMoves().join('');
		assert.notEqual(['x1z1', 'y3x1', 'z1y3'].indexOf(moves), -1);
		
		cubeState = new CubeState(0b01011010, 0b00010111, 0b11000110, 0b0101010000011100);
		moves = cubeState.getNormalizationMoves().join('');
		assert.notEqual(['x1z3', 'y1x1', 'z3y1'].indexOf(moves), -1);
		
		cubeState = new CubeState(0b01110010, 0b11010001, 0b11100100, 0b1111010111010000);
		moves = cubeState.getNormalizationMoves().join('');
		assert.notEqual(['x1y2', 'y2x3', 'z2x1'].indexOf(moves), -1);
		
		cubeState = new CubeState(0b01110100, 0b01011001, 0b10011100, 0b0001000101010011);
		moves = cubeState.getNormalizationMoves().join('');
		assert.notEqual(['x3y3', 'y3z1', 'z1x3'].indexOf(moves), -1);
	});
	
	let isNormalized = function(cubeState) {
		return (cubeState.o & 0b1100000000000000) == 0 &&
			(cubeState.p2 & 0b10000000) && 
			(cubeState.p1 & 0b10000000) && 
			(cubeState.p0 & 0b10000000);
	};
	
	it('cubeState.normalize()', function() {
		cubeState = new CubeState();
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b11110000, 0b11001100, 0b10101010, 0b0000000000000000);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b11001100, 0b11010001, 0b10100101, 0b0000110101010100);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b10111000, 0b01101001, 0b11100100, 0b0001001100111111);		
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b01010011, 0b10001011, 0b01001110, 0b0111000111000000);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b10001101, 0b01001110, 0b01010101, 0b1100010100001100);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b00100111, 0b00011011, 0b10010101, 0b0001110011000001);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b11010100, 0b10001110, 0b00011101, 0b0000010011011100);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b00110101, 0b10011100, 0b00001111, 0b1101000001110000);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b01011010, 0b00010111, 0b11000110, 0b0101010000011100);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b01110010, 0b11010001, 0b11100100, 0b1111010111010000);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
		
		cubeState = new CubeState(0b01110100, 0b01011001, 0b10011100, 0b0001000101010011);
		moves = cubeState.normalize();
		assert(isNormalized(cubeState));
	});
});
