'use strict';
/** For writing and reading tables from files
*/

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function toFile(fileName, t) {
	let buf;
	if(t instanceof Map) {
		buf = new Buffer(JSON.stringify(Array.from(t)));
	} else if(t.buffer instanceof ArrayBuffer) {  // typed array
		buf = new Buffer(t.buffer);
	} else {
		buf = new Buffer(t);
	}
	
	try {
		fs.mkdirSync(path.dirname(fileName));
	} catch(e){};
	
	fs.writeFileSync(fileName, zlib.deflateSync(buf));
}

function fromFile(fileName, type) {
	let buf = zlib.inflateSync(fs.readFileSync(fileName));
	
	if(type == 'Map') return new Map(JSON.parse(buf));
	if(global[type] && new global[type]().buffer instanceof ArrayBuffer) {  // typed array
		return new global[type](new Uint8Array(buf).buffer);
	}
	
	return JSON.parse(buf);
}

function exists(fileName) {
	try {
		fs.accessSync(fileName);
	} catch(e) {
		return false;
	}
	return true;
}

module.exports = { toFile, fromFile, exists };
