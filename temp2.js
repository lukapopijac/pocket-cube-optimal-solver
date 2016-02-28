var move = require('./main');

var state = {
	p: parseInt('000001010011100101110111', 2),  // solved permutation (3 bits per cubie)
	o: parseInt('0000000000000000', 2),          // solved orientation (2 bits per cubie)
};
state.toString = function() {
	var ps = (this.p+(1<<24)).toString(2).slice(1).match(/.{3}/g).map(x=>parseInt(x,2));
	var os = (this.o+(1<<16)).toString(2).slice(1).match(/.{2}/g).map(x=>parseInt(x,2));
	return '┌ ' + ps + ' ┐' + '\n' + 
	       '└ ' + os + ' ┘';
}

var U1 = move.U1;



//for(var i=0; i<1000000; i++) {
//	move.R2(state);
//	move.U2(state);
//	move.F2(state);
//	move.F1(state);
//	move.U1(state);
//	move.R1(state);
//	move.F3(state);
//	move.R3(state);
//	move.U3(state);
//}
//console.log(''+state);




var arr = [];
for(var i0=0; i0<8; i0++) {
	for(var i1=0; i1<8; i1++) {
		if(i1===i0) continue;
		for(var i2=0; i2<8; i2++) {
			if(i2==i0 || i2==i1) continue;
			for(var i3=0; i3<8; i3++) {
				if(i3==i0 || i3==i1 || i3==i2) continue;
				arr.push([i0,i1,i2,i3]);
			}
		}
	}
}

console.log(arr.length);

var brr = [];
for(var i=0; i<arr.length; i++) {
	var c = arr[i];
	brr.push(c[0]<<21 | c[1]<<18 | c[2]<<15 | c[3]<<12); // U
	brr.push(c[0]<<21 | c[1]<<18 | c[2]<<9  | c[3]<<6);  // F
	brr.push(c[0]<<21 | c[1]<<15 | c[2]<<9  | c[3]<<3);  // R
	brr.push(c[0]<<18 | c[1]<<12 | c[2]<<6  | c[3]);     // L
	brr.push(c[0]<<15 | c[1]<<12 | c[2]<<3  | c[3]);     // B
	brr.push(c[0]<<9  | c[1]<<6  | c[2]<<3  | c[3]);     // D
}

console.log(brr.length);
//console.log((brr[0]|1<<24).toString(2));
//console.log((brr[1]|1<<24).toString(2));
//console.log((brr[2]|1<<24).toString(2));
//console.log((brr[3]|1<<24).toString(2));

console.log('---');

var crr = [];
for(var i=0; i<brr.length; i++) {
	var b = brr[i];
	//var hash = ((b*0x5555)^(b>>10)) & parseInt('111111111111111111', 2);
	var hash = (b^b>>3^b>>6) & parseInt('111111111111111111', 2);
	if(!crr[hash]) crr[hash] = [];
	crr[hash].push(b);
}

var cnt = 0;
for(var i=0; i<crr.length; i++) {
	if(crr[i] && crr[i].length>1) {
		cnt++;
		if(crr[i].length>5) console.log(crr[i].length)//(crr[i]|1<<24).toString(2));
	}
}

console.log('cnt', cnt);
console.log(crr.length);

var drr = new Int32Array(1<<18);
for(var i=0; i<brr.length; i++) {
	var b = brr[i];
	//var hash = ((b*0x5555)^(b>>10)) & parseInt('111111111111111111', 2);
	var hash = (b^b>>3^b>>6) & parseInt('111111111111111111', 2);
	drr[hash] = b;
}

console.log('------------');

var o0 = parseInt('1100000000000000', 2);
var o1 = parseInt('0011000000000000', 2);
var o2 = parseInt('0000110000000000', 2);
var o3 = parseInt('0000001100000000', 2);
var o4 = parseInt('0000000011000000', 2);
var o5 = parseInt('0000000000110000', 2);
var o6 = parseInt('0000000000001100', 2);
var o7 = parseInt('0000000000000011', 2);

var ou = parseInt('0000000011111111', 2);
var of = parseInt('0000111100001111', 2);
var or = parseInt('0011001100110011', 2);

var pur = parseInt('000000000000111111111111', 2);
var pul = parseInt('111111111111000000000000', 2);

var U1x = function(s) {
	var b = s.p&pul;
	s.p = (s.p&pur) | drr[(b^b>>3^b>>6) & 262143];
	s.o = s.o&ou | s.o>>2&o1 | s.o>>4&o3 | s.o<<2&o2 | s.o<<4&o0;
}


var U1y = function(s) {
	var b = (s.p&pul)>>3;
	s.p = (s.p&pur) | frr[b];
	//s.o = s.o&ou | s.o>>2&o1 | s.o>>4&o3 | s.o<<2&o2 | s.o<<4&o0;
}

var frr = new Int32Array(1<<21);
for(var i=0; i<frr.length; i++) {
	frr[i] = i;
}

//console.log(''+state);
//U1y(state);
//console.log(''+state);

console.time('a');
for(var i=0; i<100000000; ++i) {
	U1(state);
}
console.timeEnd('a');

console.time('b');
for(var i=0; i<100000000; ++i) {
	U1x(state);
}
console.timeEnd('b');

console.time('c');
for(var i=0; i<100000000; ++i) {
	U1y(state);
}
console.timeEnd('c');