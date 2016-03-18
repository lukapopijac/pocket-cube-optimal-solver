'use strict';
const State3 = require('./state3');
const fileTable = require('./fileTable');

function hash2state3(state) { //avg 6.926641268004115    len 124416 124416
	let p = state.p;
	let o = state.o;
	return (
		(((p[0]&1) + (p[1]&6))<<6) + 
		(((p[2]&2) + (p[3]&5))<<3) + 
		((p[4]&3) + (p[5]&4))
	  ) * 243 + 
	  (o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[5]);
}


function hash3state3(state) { //avg 7.613141932441701    len 373248 373248
	let p = state.p;
	let o = state.o;
	return (
			(((p[0]&1) + (p[1]&6))<<6) + 
			(((p[2]&2) + (p[3]&5))<<3) + 
			((p[4]&3) + (p[5]&4))
		) * 729 + 
		(o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[4] + 243*o[5]);
}


module.exports = function(id) {
	if(id=='hash2-state3') {
		const hashTable2 = fileTable.fromFile('tables/hashtable2.gz', 'Uint8Array');
		return state => hashTable2[hash2state3(state)];	
	}
	if(id=='hash3-state3') {
		const hashTable3 = fileTable.fromFile('tables/hashtable3.gz', 'Uint8Array');
		return state => hashTable3[hash3state3(state)];
	}
};
