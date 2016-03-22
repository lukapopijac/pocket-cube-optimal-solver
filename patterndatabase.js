'use strict';
const fileTable = require('./fileTable');
let table;  // full table


let hashes = {
	hash5: function(state) { //avg 7.599925518689986    len 373248 373248
		let p2 = state.p2;
		let p1 = state.p1;
		let p0 = state.p0;

		let v = state.o - ((state.o&0b1010101010101010)>>1);
		
		return (p2&0b111 | (p1&0b11100)<<2 | (p0&0b110001)<<3) * 729 +
			(v&0b11) + 
			(v&0b1100)*3/4 + 
			(v&0b110000)*9/16 + 
			(v&0b11000000)*27/64 + 
			(v&0b1100000000)*81/256 + 
			(v&0b110000000000)*243/1024;
	}
}


function generateTable(id) {
	if(id=='hash5') {
		let hashTable = new Uint8Array(373248).fill(255);
		table = table || fileTable.fromFile('tables/table11.gz', 'Map');
		let keys = table.keys();
		
		console.time('generate hash table, ' + id);
		for(let key of keys) {  // key represents state
			let val = table.get(key);
			
			let o = key>>18;
			let p2 = key>>12 & 63;
			let p1 = key>>6 & 63;
			let p0 = key & 63;
			
			// These are not really p2, p1, p0, o, just their lower 6 bits.
			// Higher 2 bits are not important as they are not used in hash5.
			let state = {p2, p1, p0, o};
			
			addToHashTable(hashTable, hash5(state), val);
		}
		average(hashTable);
		fileTable.toFile('tables/hash5.gz', hashTable);
		console.timeEnd('generate hash table, ' + id);
	}
}

function addToHashTable(hashTable, idx, val) {
	if(val < hashTable[idx]) hashTable[idx] = val;
}

function average(hashTable) {
	let s = 0;
	let k = 0;
	for(let i=0; i<hashTable.length; ++i) {
		let v = hashTable[i];
		if(v<15) {
			s += v;
			k++;
		}
	}
	console.log('avg', s/k, '   len', k, hashTable.length);
	return s/k;
}

module.exports = {
	getTable: function(id) {
		let hashTable = fileTable.fromFile('tables/' + id + '.gz', 'Uint8Array');
		let hash = hashes[id];
		return state => hashTable[hash(state)];
	}, 
	generateTable
};
