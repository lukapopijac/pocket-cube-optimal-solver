'use strict';
const table = require('./patterndatabase').getTable('hash3-state4');

class SearchState {
	constructor(state, prevSearchState, lastMove) {
		this.state = state;
		this.prevSearchState = prevSearchState || null;
		this.lastMove = lastMove || null;
		this.h = -1;
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
			new SearchState(this.state.generateNextState(move), this, move)
		);
	}
	
	heuristics() {
		if(this.h<0) this.h = table(this.state);
		return this.h;
	}
	
	isGoal() {
		return this.state.isSolved();
	}
}


module.exports = SearchState;
