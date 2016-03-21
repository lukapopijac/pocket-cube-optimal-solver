'use strict';
const fileTable = require('./fileTable');
let table;  // full table

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


function hash3state4(state) { //avg 7.599945880341972    len 373247 373248
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


function getTable(id) {
	if(id=='hash2-state3') {
		let hashTable = fileTable.fromFile('tables/hash2state3.gz', 'Uint8Array');
		return state => hashTable[hash2state3(state)];
	}
	if(id=='hash3-state3') {
		let hashTable = fileTable.fromFile('tables/hash3state3.gz', 'Uint8Array');
		return state => hashTable[hash3state3(state)];
	}
	if(id=='hash3-state4') {
		let hashTable = fileTable.fromFile('tables/hash3state4.gz', 'Uint8Array');
		return state => hashTable[hash3state4(state)];
	}
}


function generateTable(id) {
	let hashFunction;
	let hashTable;
	let fileName;
	let poToState;
	
	if(id=='hash2-state3') {
		hashFunction = hash2state3;
		hashTable = new Uint8Array(124416).fill(255);
		fileName = 'tables/hash2state3.gz';
		poToState = (p, o) => {return {p, o}};
	}
	if(id=='hash3-state3') {
		hashFunction = hash3state3;
		hashTable = new Uint8Array(373248).fill(255);
		fileName = 'tables/hash3state3.gz';
		poToState = (p, o) => {return {p, o}};
	}
	if(id=='hash3-state4') {
		hashFunction = hash3state4;
		hashTable = new Uint8Array(373248).fill(255);
		fileName = 'tables/hash3state4.gz';
		poToState = function(p, o) {
			let p2=0, p1=0, p0=0, v=0;
			for(let i=0; i<8; i++) {
				let pi = p[i];
				if(pi&0b100) p2 |= 1<<i;
				if(pi&0b010) p1 |= 1<<i;
				if(pi&0b001) p0 |= 1<<i;
				
				let oi = o[i];
				if(oi==1) v |= 0b01<<2*i;
				if(oi==2) v |= 0b11<<2*i;
			}
			return {p2, p1, p0, o: v};
		};
	}
	
	table = table || fileTable.fromFile('tables/table11.gz', 'Map');
	let keys = table.keys();
	
	console.time('generate hash table, ' + id);
	for(let key of keys) {  // key represents state
		let val = table.get(key);
		let s = key.split('').map(x=>+x);
		let p = s.slice(0,7);
		let o = s.slice(7);
		p.push(7);
		o.push(o.reduce((acc,curr)=>acc-curr, 30) % 3, 0);
		
		addToHashTable(hashTable, hashFunction(poToState(p, o)), val);
	}
	average(hashTable);
	fileTable.toFile(fileName, hashTable);
	console.timeEnd('generate hash table, ' + id);
}

function average(hashTable) {
	let s = 0;
	let k = 0;
	for(let i=0; i<hashTable.length; ++i) {
		let v = hashTable[i];
		if(v>0) {
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

module.exports = {getTable, generateTable};
