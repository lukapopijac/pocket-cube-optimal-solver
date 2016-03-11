'use strict';
var assert = require('assert');

describe('fileTable', function() {
	var fileTable = require('../filetable');

	it('small map object', function() {
		let map_in = new Map();
		for(let i=0; i<10; i++) map_in.set(Math.random()*1000000|0, Math.random()*100|0);

		fileTable.toFile('map-small-test.gz', map_in);
		
		let map_out = fileTable.fromFile('map-small-test.gz');
		
		assert.deepEqual(Array.from(map_in), Array.from(map_out));
	});

	it.skip('big map object', function() {
		let map_in = new Map();
		for(let i=0; i<4e6; i++) map_in.set(Math.floor(Math.random()*1e15), Math.random()*12|0);

		fileTable.toFile('map-big-test.gz', map_in);
		
		let map_out = fileTable.fromFile('map-big-test.gz');
		
		assert.deepEqual(Array.from(map_in), Array.from(map_out));
	});
	
	
});
