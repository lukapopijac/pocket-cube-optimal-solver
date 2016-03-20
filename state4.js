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

class State {
	constructor(p2, p1, p0, o) {
		this.p2 = p2 || 0b11110000;
		this.p1 = p1 || 0b11001100;
		this.p0 = p0 || 0b10101010;
		this.o = o || 0b0000000000000000;
	}
	
	/** Generates new State instance
	*/
	static generateNextState(state, move) {
		var a, b;
		switch(move) {
			case 'U1': a = [2,0,3,1,4,5,6,7]; b = [0,0,0,0,0,0,0,0]; break;
			case 'U2': a = [3,2,1,0,4,5,6,7]; b = [0,0,0,0,0,0,0,0]; break;
			case 'U3': a = [1,3,0,2,4,5,6,7]; b = [0,0,0,0,0,0,0,0]; break;
			case 'F1': a = [1,5,2,3,0,4,6,7]; b = [1,2,0,0,2,1,0,0]; break;
			case 'F2': a = [5,4,2,3,1,0,6,7]; b = [0,0,0,0,0,0,0,0]; break;
			case 'F3': a = [4,0,2,3,5,1,6,7]; b = [1,2,0,0,2,1,0,0]; break;
			case 'R1': a = [4,1,0,3,6,5,2,7]; b = [2,0,1,0,1,0,2,0]; break;
			case 'R2': a = [6,1,4,3,2,5,0,7]; b = [0,0,0,0,0,0,0,0]; break;
			case 'R3': a = [2,1,6,3,0,5,4,7]; b = [2,0,1,0,1,0,2,0]; break;
			case 'x1': a = [4,5,0,1,6,7,2,3]; b = [2,1,1,2,1,2,2,1]; break;
			case 'x2': a = [6,7,4,5,2,3,0,1]; b = [0,0,0,0,0,0,0,0]; break;
			case 'x3': a = [2,3,6,7,0,1,4,5]; b = [2,1,1,2,1,2,2,1]; break;
			case 'y1': a = [2,0,3,1,6,4,7,5]; b = [0,0,0,0,0,0,0,0]; break;
			case 'y2': a = [3,2,1,0,7,6,5,4]; b = [0,0,0,0,0,0,0,0]; break;
			case 'y3': a = [1,3,0,2,5,7,4,6]; b = [0,0,0,0,0,0,0,0]; break;
			case 'z1': a = [1,5,3,7,0,4,2,6]; b = [1,2,2,1,2,1,1,2]; break;
			case 'z2': a = [5,4,7,6,1,0,3,2]; b = [0,0,0,0,0,0,0,0]; break;
			case 'z3': a = [4,0,6,2,5,1,7,3]; b = [1,2,2,1,2,1,1,2]; break;
		}
		
		let p2 = state.p2;
		let	p1 = state.p1;
		let p0 = state.p0;  // new permutation
		let o = 0;          // new orientation
		
		for(let i=0; i<8; i++) {
			let bit = 1<<a[i];
			let m = 1<<i;
			
			if(bit & state.p2) p2|=m; else p2&=~m;
			if(bit & state.p1) p1|=m; else p1&=~m;
			if(bit & state.p0) p0|=m; else p0&=~m;
			
			let v = state.o>>(2*a[i]) & 0b11;
			if(b[i]==1) v = v==0b00 ? 0b01 : v==0b01 ? 0b11 : 0b00;
			if(b[i]==2) v = v==0b00 ? 0b11 : v==0b01 ? 0b00 : 0b01;
			o = o & ~(0b11<<2*i) | v<<2*i;
		}
		
		//console.log('generate next state');
		//console.log('start state ' + state);
		//console.log('move ', move);
		var ss = new State(p2, p1, p0, o);
		//console.log('end state ' + ss);
		//console.log('---------------------');
		
		return ss;
	}
	
	static generateState(moves, startState) {
		//console.log(moves, startState);
		if(typeof moves == 'string') {
			moves = moves.split(' ').map(x => {
				if(x.length==1) return x+'1';
				if(x[1]=="'") return x[0]+'3';
				return x;
			});
		}
		let s = startState ? startState : new State();
		moves.forEach(move => {s = State.generateNextState(s, move)});
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
		
		return '[' + ps + '] [' + os + ']';
	}
	
	// works only for normalized state
	isSolved() {
		return this.p2==0b11110000 && this.p1==0b11001100 && this.p0==0b10101010 && 
		       this.o==0b0000000000000000;
	}
	
	_isNormalized() {
		return (this.p2&this.p1&this.p0) == 0b10000000 && (this.o&0b1100000000000000) == 0;
	}
	
	// Get moves needed to rotate cube so cubie 7 is in its right place and orientation.
	static getNormalizationMoves(state) {
		//console.log('get normalization moves');
		//console.log(state.toString());
		if(state._isNormalized()) return [];
		let moves = ['x1', 'x2', 'x3', 'y1', 'y2', 'y3', 'z1', 'z2', 'z3'];
		
		// one move
		for(let move1 of moves) {
			let s1 = State.generateNextState(state, move1);
			//console.log(move1, s1.toString());
			if(s1._isNormalized()) return [move1];
		}
		
		// two moves
		for(let move1 of moves) {
			//console.log(move1);
			let s1 = State.generateNextState(state, move1);
			for(let move2 of moves) {
				//console.log('    ', move2);
				if(move2[0] == move1[0]) continue;  // same axis of rotation
				let s2 = State.generateNextState(s1, move2);
				if(s2._isNormalized()) return [move1, move2];
			}
		}
	}
	
	// Rotate cube so cubie 7 is in its right place and orientation
	normalize() {
		//console.log('normalize', this+'');
		let moves = State.getNormalizationMoves(this);
		//console.log(moves);
		let state = State.generateState(moves, this);
		this.p2 = state.p2;
		this.p1 = state.p1;
		this.p0 = state.p0;
		this.o = state.o;
	}
	
}


module.exports = State;
