'use strict';

class Bla {
	constructor() {
		this.a = 'a';
		this.b = 'b';
	}
	
	dodo() {
		let h = new Bla();
	}
}

var g = new Bla();

g.dodo();



for(let v of [0,1,3]) {
	console.log(v, 5*v+2>>1&3, v+7>>1&3);
}