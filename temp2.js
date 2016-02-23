var move = require('./main');


var state = {
	p: parseInt('000001010011100101110111', 2),  // solved permutation (3 bits per cubie)
	o: parseInt('0000000000000000', 2),          // solved orientation (2 bits per cubie)
};
state.toString = function() {
	return 'p: ' + (this.p+(1<<24)).toString(2).slice(1) +
		'   o: ' + (this.o+(1<<16)).toString(2).slice(1);
}


console.time('a');
for(var i=0; i<10000000; i++) {
	move.U1(state);
	move.U2(state);
	move.U3(state);
	move.F1(state);
	move.F2(state);
	move.F3(state);
	move.R1(state);
	move.R2(state);
	move.R3(state);
}
console.timeEnd('a');

