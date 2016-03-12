'use strict';
var assert = require('assert');

describe('fileTable', function() {
	var fileTable = require('../filetable');

	function areMapsEqual(map1, map2) {
		if(map1.size != map2.size) return false;
		return [...map1].every(x => x[1] === map2.get(x[0]))
	}
	
	it('map object', function() {
		let map_in = new Map();
		for(let i=0; i<10000; i++) map_in.set((1+Math.sin(i))*1000000|0, (1+Math.cos(i))*6|0);
		
		fileTable.toFile('test/map-test.gz', map_in);
		let map_out = fileTable.fromFile('test/map-test.gz', 'Map');
		
		assert(areMapsEqual(map_in, map_out));
	});
});
