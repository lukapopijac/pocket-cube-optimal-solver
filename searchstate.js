'use strict';

const State = require('./state3');
const fileTable = require('./fileTable');

const hashTable = fileTable.fromFile('tables/hashtable3.gz', 'Uint8Array');

function hash2(p, o) { //avg 6.926641268004115    len 124416 124416
	return (
		(((p[0]&1) + (p[1]&6))<<6) + 
		(((p[2]&2) + (p[3]&5))<<3) + 
		((p[4]&3) + (p[5]&4))
	  ) * 243 + 
	  (o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[5]);
}

function hash3(p, o) { //avg 7.613141932441701    len 373248 373248
	return (
			(((p[0]&1) + (p[1]&6))<<6) + 
			(((p[2]&2) + (p[3]&5))<<3) + 
			((p[4]&3) + (p[5]&4))
		) * 729 + 
		(o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[4] + 243*o[5]);
}




class SearchState {
	constructor(state, prevSearchState, lastMove) {
		this.state = state || new State();
		this.prevSearchState = prevSearchState || null;
		this.lastMove = lastMove || null;
	}
	
	expand() {
		let moves;
		let lastSide = this.lastMove && this.lastMove[0];
		switch(lastSide) {
			case 'U': moves = ['F1', 'F2', 'F3', 'R1', 'R2', 'R3']; break;
			case 'F': moves = ['U1', 'U2', 'U3', 'R1', 'R2', 'R3']; break;
			case 'R': moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3']; break;
			default: moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3'];
		}
		return moves.map(move => 
			new SearchState(State.generateNextState(this.state, move), this, move)
		);
	}
	
	heuristics(min) {
		return hashTable[hash3(this.state.p, this.state.o)];
	}
	
	isGoal() {
		return this.state.isSolved();
	}
}


module.exports = SearchState;
