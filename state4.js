'use strict';

/**
Example:
cubie positions:  7, 6, 5, 4, 3, 2, 1, 0

permutation:      3, 7, 4, 2, 6, 0, 5, 1
         p2 = 0b  0  1  1  0  1  0  1  0
         p1 = 0b  1  1  0  1  1  0  0  0
         p0 = 0b  1  1  0  0  0  0  1  1

orientation:      1, 0, 2, 2, 0, 1, 1, 2
         o  = 0b 01 00 11 11 00 01 01 11
		 
Orientation 1 (01) means that cubie is oriented 1 step clockwise from solved.
Orientation 2 (11) means that cubie is oriented 1 step counterclockwise from solved.
Codes for orientations 0,1,2 are 00,01,11. The reason is to be able to determine 
is cubie correctly oriented only by looking at one bit, the right one.
*/

const transforms = require('./transforms');
let transP = transforms.p;
let transO = transforms.o;

class State {
	constructor(p2, p1, p0, o) {
		this.p2 = p2 || 0b11110000;
		this.p1 = p1 || 0b11001100;
		this.p0 = p0 || 0b10101010;
		this.o = o || 0b0000000000000000;
	}
	
	/** Generates new State instance
	*/
	generateNextState(move) {
		let t = transP[move];
		return new State(t[this.p2], t[this.p1], t[this.p0], transO[move][this.o]);
	}
	
	static generateState(moves, startState) {
		if(typeof moves == 'string') {
			moves = moves.split(' ').map(x => {
				if(x.length==1) return x+'1';
				if(x[1]=="'") return x[0]+'3';
				return x;
			});
		}
		let s = startState ? startState : new State();
		moves.forEach(move => {s = s.generateNextState(move)});
		return s;
	}
	
	toString() {
		let ps0 = ('0000000' + this.p0.toString(2)).split('').reverse().slice(0,8).map(x => +x);
		let ps1 = ('0000000' + this.p1.toString(2)).split('').reverse().slice(0,8).map(x => +x);
		let ps2 = ('0000000' + this.p2.toString(2)).split('').reverse().slice(0,8).map(x => +x);
		
		let ps = [];
		for(let i=0; i<8; i++) ps.push(ps0[i] + ps1[i]*2 + ps2[i]*4);
		
		let os = (131072+this.o).toString(2).match(/.{1,2}/g).reverse().map(x => x=='00' ? 0 : x=='01' ? 1 : 2);
		os.pop();
		
		return '[' + ps + '][' + os + ']';
	}
	
	// works only for normalized state
	isSolved() {
		return this.o==0b0000000000000000 && this.p2==0b11110000 && this.p1==0b11001100 && this.p0==0b10101010;
	}
	
	_isNormalized() {
		return (this.p2&this.p1&this.p0) == 0b10000000 && (this.o&0b1100000000000000) == 0;
	}
	
	// Get moves needed to rotate cube so cubie 7 is in its right place and orientation.
	getNormalizationMoves() {
		if(this._isNormalized()) return [];
		let moves = ['x1', 'x2', 'x3', 'y1', 'y2', 'y3', 'z1', 'z2', 'z3'];
		
		// one move
		for(let move1 of moves) {
			let s1 = this.generateNextState(move1);
			if(s1._isNormalized()) return [move1];
		}
		
		// two moves
		for(let move1 of moves) {
			let s1 = this.generateNextState(move1);
			for(let move2 of moves) {
				if(move2[0] == move1[0]) continue;  // same axis of rotation
				let s2 = s1.generateNextState(move2);
				if(s2._isNormalized()) return [move1, move2];
			}
		}
	}
	
	// Rotate cube so cubie 7 is in its right place and orientation
	normalize() {
		let moves = this.getNormalizationMoves();
		let state = State.generateState(moves, this);
		this.p2 = state.p2;
		this.p1 = state.p1;
		this.p0 = state.p0;
		this.o = state.o;
		return moves;
	}
	
}


module.exports = State;
