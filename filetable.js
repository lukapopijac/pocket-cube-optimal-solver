'use strict';
/** For writing and reading tables from files
*/

var zlib = require('zlib');
var fs = require('fs');

function toFile(filename, obj) {
	let type = obj.constructor.name;
	let dictionary = '';
	let buf;
	if(type == 'Map') {
		buf = new Buffer(JSON.stringify(Array.from(obj)));
	} else if(type == 'Object') {
		buf = new Buffer(JSON.stringify(obj));
	} else {
		buf = new Buffer(obj);
	}
	
	fs.writeFileSync(filename, zlib.deflateSync(buf));
}

function fromFile(filename, type) {
	let buf = zlib.inflateSync(fs.readFileSync(filename));
	if(type == 'Map') return new Map(JSON.parse(buf));
	if(type == 'Object') return JSON.parse(buf);
}

module.exports = { toFile, fromFile };
