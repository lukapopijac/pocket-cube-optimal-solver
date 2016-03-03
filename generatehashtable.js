var State = require('./state2');
var readTable = require('./readtable');

readTable('table11.gz').then(function(table) {
	var keys = Object.keys(table);
	var hashTable1 = [];
	var hashTable2 = [];
	var hashTable3 = [];
	
	console.time();
	for(var i=0; i<keys.length; i++) {
		var key = keys[i];  // state
		var val = table[key];
		var s = key.split('').map(x=>+x);
		var p = s.slice(0,7);
		var o = s.slice(7);
		
		addToHashTable(hashTable1, hash1(p, o), val);
		//addToHashTable(hashTable2, hash2(p, o), val);
		//addToHashTable(hashTable3, hash3(p, o), val);
	}
	console.timeEnd();
	
	average(hashTable1);
	average(hashTable2);
	average(hashTable3);	
});

function hash1(p, o) {
	//
	return  ((p[0]&3) + ((p[1]&6)<<1) + ((p[2]&1)<<4)) * 729 +
	(o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[4] + 243*o[5]);
}


function hash2(p, o) {
	//avg 6.926641268004115    len 124416 124416
	return (
		(((p[0]&1) + (p[1]&6))<<6) + 
		(((p[2]&2) + (p[3]&5))<<3) + 
		((p[4]&3) + (p[5]&4))
	  ) * 243 + 
	  (o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[5]);
}

function hash3(p, o) {
	//avg 7.613141932441701    len 373248 373248
	return (
			(((p[0]&1) + (p[1]&6))<<6) + 
			(((p[2]&2) + (p[3]&5))<<3) + 
			((p[4]&3) + (p[5]&4))
		) * 729 + 
		(o[0] + 3*o[1] + 9*o[2] + 27*o[3] + 81*o[4] + 243*o[5]);
}


function average(hashTable) {
	var s = 0;
	var k = 0;
	for(var i=0; i<hashTable.length; ++i) {
		var v = hashTable[i];
		if(!isNaN(v)) {
			s += v;
			k++;
		}
	}
	console.log('avg', s/k, '   len', k, hashTable.length);
	return s/k;
}


function addToHashTable(hashTable, idx, val) {
	var last = hashTable[idx];
	if(isNaN(last) || val<last) hashTable[idx] = val;	
}
