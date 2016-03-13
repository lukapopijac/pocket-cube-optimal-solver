'use strict';
/** For writing and reading tables from files
*/

var zlib = require('zlib');
var fs = require('fs');

function toFile(filename, t) {
	let buf;
	if(t instanceof Map) {
		buf = new Buffer(JSON.stringify(Array.from(t)));
	} else if(t.buffer instanceof ArrayBuffer) {  // typed array
		buf = new Buffer(t.buffer);
	} else {
		buf = new Buffer(t);
	}
	
	fs.writeFileSync(filename, zlib.deflateSync(buf));
}

function fromFile(filename, type) {
	let buf = zlib.inflateSync(fs.readFileSync(filename));
	
	if(type == 'Map') return new Map(JSON.parse(buf));
	if(global[type] && new global[type]().buffer instanceof ArrayBuffer) {  // typed array
		return new global[type](new Uint8Array(buf).buffer);
	}
	
	return JSON.parse(buf);
}

module.exports = { toFile, fromFile };
