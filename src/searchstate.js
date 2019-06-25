const expandMoves = {
	'U': ['F1', 'F2', 'F3', 'R1', 'R2', 'R3'],
	'F': ['U1', 'U2', 'U3', 'R1', 'R2', 'R3'],
	'R': ['U1', 'U2', 'U3', 'F1', 'F2', 'F3'],
	'': ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3']
};

class SearchState {
	constructor(state, prevSearchState, lastMove) {
		this.state = state;  // this is public variable
		this.prevSearchState = prevSearchState || null;
		this.lastMove = lastMove || null;
	}

	expand() {
		let lastSide = this.lastMove && this.lastMove[0] || '';
		return expandMoves[lastSide].map(move => 
			new SearchState(this.state.generateNextState(move), this, move)
		);
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

module.exports = SearchState;
