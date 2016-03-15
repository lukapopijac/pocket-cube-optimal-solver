'use strict';

class Bla {
	constructor() {
		this.a = 'a';
		this.b = 'b';
	}
	
	dodo() {
		let h = new Bla();
		this = h;
	}
}

var g = new Bla();

g.dodo();