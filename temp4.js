'use strict';

function* gen() {
	yield* [2,4,7,9,12,15,17];
}

var g = gen();

for(var h of g) {
	console.log(h);
}

//console.log(g.next());
//console.log(g.next());
//console.log(g.next());
//console.log(g.next());
//console.log(g.next());
//console.log(g.next());
//console.log(g.next());
//console.log(g.next());
//console.log(g.next());

