'use strict';

const State = require('./state3');

class SearchState extends State {
	constructor(p, o, prevSearchState, lastMove) {
		super(p, o);
		this.prevSearchState = prevSearchState || null;
		this.lastMove = lastMove || null;
	}
	
	expand() {
		
	}
	
	//static generateNextState(searchState, move) {
	//	var state = State.generateNextState(searchState, move);
	//	return new SearchState(state.p, state.o, searchState, move);
	//}

	
}


module.exports = SearchState;
