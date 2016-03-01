var State = require('./state2');

var table = {};

function generateStates(node, depth, maxdepth) {
	var key = node.key();
	var k = table[key];
	if(isNaN(k) || depth<k) table[key] = depth;
	else return null;  // don't explore this node as it has already been explored
	if(depth == maxdepth) return null;
	var successors = expand(node);
	for(var i=0; i<successors.length; ++i) {
		generateStates(successors[i], depth+1, maxdepth);
	}
	return null;
}

function expand(state) {
	var moves = [];
	var lastSide = state.lastMove && state.lastMove[0];
	switch(lastSide) {
		case 'U': moves = ['F1', 'F2', 'F3', 'R1', 'R2', 'R3']; break;
		case 'F': moves = ['U1', 'U2', 'U3', 'R1', 'R2', 'R3']; break;
		case 'R': moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3']; break;
		default: moves = ['U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3'];
	}
	return moves.map(x => state.move(x));
}

function main() {
	console.time('time');
	generateStates(new State(), 0, 7);
	console.timeEnd('time');
	//console.log(table);
	console.log(Object.keys(table).length);
}

main();

var bson = require('bson');
var BSON = new bson.BSONPure.BSON();

var ser = BSON.serialize(table, false, true, false);

var fs = require('fs');
fs.writeFile('table.bin', ser, (err) => { 
	if(err) throw err;
	console.log('saved'); 
});
