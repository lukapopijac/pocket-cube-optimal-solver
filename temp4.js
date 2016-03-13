'use strict';

function* gen() {
	yield* [2,15,17];
}

var g = gen();

for(var h of g) {
	console.log(h);
}

console.log('--------');

var a = new Int32Array([3,-2,258]);

var b = new Buffer(a.buffer);

var c = new Int32Array(b);

var d = new Uint8Array(b);

var e = new Int32Array(d.buffer);

console.log('a',a);
console.log('b',b);
console.log('c',c);
console.log('d',d);
console.log('e',e);
console.log('----------');

var zlib = require('zlib');

var a = new Int32Array([3,-2,258]);
var b = new Buffer(a.buffer);
var c = zlib.deflateSync(b);
var d = zlib.inflateSync(c);
var e = new Uint8Array(d);
var f = new Int32Array(e.buffer);

console.log('a',a);
console.log('b',b);
console.log('c',c);
console.log('d',d);
console.log('e',e);
console.log('f',f);
console.log('a',a);
