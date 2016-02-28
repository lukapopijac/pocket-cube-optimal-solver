var drr = new Int32Array(1<<18);
for(var i=0; i<drr.length; i++) {
	drr[i] = i;
}

var frr = new Int32Array(1<<21);
for(var i=0; i<frr.length; i++) {
	frr[i] = i;
}

function tostr(x) {
	console.log(((1<<24) + x).toString(2).slice(1));
}

var p0 = parseInt('111000000000000000000000', 2);
var p1 = parseInt('000111000000000000000000', 2);
var p2 = parseInt('000000111000000000000000', 2);
var p3 = parseInt('000000000111000000000000', 2);
var pu = parseInt('000000000000111111111111', 2);
var pur = parseInt('000000000000111111111111', 2);
var pul = parseInt('111111111111000000000000', 2);

var p = parseInt('101000010110011100111001', 2);
var q = p;

var t0 = performance.now();
var t1 = performance.now();
var time = t1-t0;
console.log(t1-t0, time);

time = 0;
console.time('a');
for(var j=0; j<1000; j++) {
	for(var i=0; i<10000; ++i) {
		t0 = performance.now();
		q ^= p&pu | p>>3&p1 | p>>6&p3 | p<<3&p2 | p<<6&p0;
		t1 = performance.now();
		time += t1-t0;
	}
}
console.timeEnd('a');
console.log(time);
tostr(q);
tostr(p&pu | p>>3&p1 | p>>6&p3 | p<<3&p2 | p<<6&p0);


//var b = p&pul;
//console.log('hash ', (b^b>>3^b>>6) & 262143);
//console.log((p&pur) | drr[(b^b>>3^b>>6) & 262143])

var b = p&pul;
drr[(b^b>>3^b>>6) & 262143] = parseInt('010101110000000000000000', 2);

q = p;
time = 0;
console.time('b');
for(var j=0; j<1000; j++) {
	for(var i=0; i<10000; ++i) {
		t0 = performance.now();
		var b = p&pul;
		q ^= (p&pur) | drr[(b^b>>3^b>>6) & 262143];
		t1 = performance.now();
		time += t1-t0;
	}
}
console.timeEnd('b');
console.log(time);
tostr(q);
tostr((p&pur) | drr[(b^b>>3^b>>6) & 262143]);


frr[(p&pul)>>3] = parseInt('010101110000000000000000', 2);
q = p;
time = 0;
console.time('c');
for(var j=0; j<1000; j++) {
	for(var i=0; i<10000; ++i) {
		t0 = performance.now();
		//q ^= (p&pur) | frr[(p&pul)>>3];
		t1 = performance.now();
		time += t1-t0;
	}
}
console.timeEnd('c');
console.log(time);
tostr(q);
tostr((p&pur) | frr[(p&pul)>>3]);

// -----------------------------------------------------
console.log('+++++++++++++++++++');

q = p;
var r;
var t0 = performance.now();
r = speed1();
var t1 = performance.now();
console.log(t1-t0);
console.log(r);

function speed1() {
	return p&pu | p>>3&p1 | p>>6&p3 | p<<3&p2 | p<<6&p0;
}
