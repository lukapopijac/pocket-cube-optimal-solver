'use strict';
var assert = require('assert');

describe('fileTable', function() {
	var fileTable = require('../filetable');

	function compareMaps(map1, map2) {
		if(map1.size !== map2.size) return false;
		return [...map1].every(x => x[1] === map2.get(x[0]));
	}
	
	function compareArrays(a1, a2) {
		if(a1.length !== a2.length) return false;
		return a1.every((x,i) => x===a2[i]);
	}
	
	it('Map object', function() {
		let n = 1000;
		let map_in = new Map();
		for(let i=0; i<n; i++) map_in.set((1+Math.sin(i))*1000000|0, (1+Math.cos(i))*6|0);
		
		fileTable.toFile('test/map-test.gz', map_in);
		let map_out = fileTable.fromFile('test/map-test.gz', 'Map');
		
		assert(map_out instanceof Map);
		assert(compareMaps(map_in, map_out));
	});
	
	it('Uint8Array', function() {
		let n = 1000;
		let arr_in = new Uint8Array(n);
		for(let i=0; i<n; i++) arr_in[i] = (1+Math.cos(i))*100 | 0;
		
		fileTable.toFile('test/uint8-test.gz', arr_in);
		let arr_out = fileTable.fromFile('test/uint8-test.gz', 'Uint8Array');
		
		assert(arr_out instanceof Uint8Array);
		assert(compareArrays(arr_in, arr_out));
	});
	
	it('Int32Array', function() {
		let n = 1000;
		let arr_in = new Int32Array(n);
		for(let i=0; i<n; i++) arr_in[i] = Math.cos(i)*2e9 | 0;
		
		fileTable.toFile('test/int32-test.gz', arr_in);
		let arr_out = fileTable.fromFile('test/int32-test.gz', 'Int32Array');
		
		assert(arr_out instanceof Int32Array);
		assert(compareArrays(arr_in, arr_out));
	});

});
