'use strict';

let a = {};
let keys = [];

function generateRandomString() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	
    for(let i=0; i<16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	
    return text;
}

let n = 60;
console.log(n);
console.time('generate keys');
for(let i=0; i<n; i++) keys.push(generateRandomString());
console.timeEnd('generate keys');

console.time('a');
for(let i=0; i<n; i++) {
	a[keys[i]] = Math.random()*1000 | 0;
}
console.timeEnd('a');

//console.log(Object.keys(a).length);

console.log('---------------');
var c = [6,2,4,1,2,0,7,5];
var b = '';

console.time('buildString2');
for(var i=0; i<10000000; i++) {
	b = '';
	for(var j=0; j<8; j++) b += c[j];
}
console.timeEnd('buildString2');

console.time('toString');
for(var i=0; i<10000000; i++) {
	b = c.toString().replace(/,/g,'');
}
console.timeEnd('toString');

console.time('buildString');
for(var i=0; i<10000000; i++) {
	b = c.reduce((prev, curr, i) => prev + curr*Math.pow(10,7-i), 0) + '';
}
console.timeEnd('buildString');




//function permutation2index(permutation) {
//	for(let i=0; i<p.length; ++i) {
//
//	}
//}
//	
// for j in range(len(p)):
//        k = sum(1 for i in p[j + 1:] if i < p[j])
//        result += k * factorial(len(p) - j - 1)
// return result
