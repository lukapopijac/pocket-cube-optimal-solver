let patternDB = _=>0;

const expandMoves = {
	'U': ['F1', 'F2', 'F3', 'R1', 'R2', 'R3'],
	'F': ['U1', 'U2', 'U3', 'R1', 'R2', 'R3'],
	'R': ['U1', 'U2', 'U3', 'F1', 'F2', 'F3'],
	'': ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3']
};

class SearchState {
	constructor(state, prevSearchState, lastMove) {
		this.state = state;
		this.prevSearchState = prevSearchState || null;
		this.lastMove = lastMove || null;
		this.h = -1;
	}
	
	expand() {
		let lastSide = this.lastMove && this.lastMove[0] || '';
		return expandMoves[lastSide].map(move => 
			new SearchState(this.state.generateNextState(move), this, move)
		);
	}
	
	heuristics() {
		if(this.h<0) this.h = patternDB(this.state);
		return this.h;
	}
	
	isGoal() {
		return this.state.isSolved();
	}
	
	getMoves() {
		let moves = [];
		let state = this;
		while(state.prevSearchState) {
			moves.push(state.lastMove);
			state = state.prevSearchState;
		}
		return moves.reverse();
	}
}

SearchState.setPatternDatabase = function(pdb) {patternDB = pdb};

module.exports = SearchState;
