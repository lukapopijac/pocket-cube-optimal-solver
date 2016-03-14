'use strict';
const State = require('./state2');
const filetable = require('./filetable');

function main() {
	let table = filetable.fromFile('tables/table11.gz', 'Map');
	
	let keys = table.keys();
	let hashTable2 = new Uint8Array(124416).fill(255);
	let hashTable3 = new Uint8Array(373248).fill(255);
	
	console.time('generate hash tables');
	for(let key of keys) {  // key represents state
		let val = table.get(key);
		let s = key.split('').map(x=>+x);
		let p = s.slice(0,7);
		let o = s.slice(7);
		
		addToHashTable(hashTable2, hash2(p, o), val);
		addToHashTable(hashTable3, hash3(p, o), val);
	}
	console.timeEnd('generate hash tables');
	
	average(hashTable2);
	average(hashTable3);
	
	console.time('save hash tables');
	filetable.toFile('tables/hashtable2.gz', hashTable2);
	filetable.toFile('tables/hashtable3.gz', hashTable3);
	console.timeEnd('save hash tables');
	
}

function hash1(p, o) { //
	return  ((p[0]&3) + ((p[1]&6)<<1) + ((p[2]&1)<<4)) * 729 +
	(o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[4] + 243*o[5]);
}


function hash2(p, o) { //avg 6.926641268004115    len 124416 124416
	return (
		(((p[0]&1) + (p[1]&6))<<6) + 
		(((p[2]&2) + (p[3]&5))<<3) + 
		((p[4]&3) + (p[5]&4))
	  ) * 243 + 
	  (o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[5]);
}

function hash3(p, o) { //avg 7.613141932441701    len 373248 373248
	return (
			(((p[0]&1) + (p[1]&6))<<6) + 
			(((p[2]&2) + (p[3]&5))<<3) + 
			((p[4]&3) + (p[5]&4))
		) * 729 + 
		(o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[4] + 243*o[5]);
}


function average(hashTable) {
	let s = 0;
	let k = 0;
	for(let i=0; i<hashTable.length; ++i) {
		let v = hashTable[i];
		if(!isNaN(v)) {
			s += v;
			k++;
		}
	}
	console.log('avg', s/k, '   len', k, hashTable.length);
	return s/k;
}


function addToHashTable(hashTable, idx, val) {
	if(val < hashTable[idx]) hashTable[idx] = val;
}

main();
