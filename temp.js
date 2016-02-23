var add1 = function(x) {x&=3; return x==2 ? 0 : x+1};  // add 1 mod 3 on last 2 bits
var add2 = function(x) {x&=3; return x==0 ? 2 : x-1};  // add 2 mod 3 on last 2 bits


var rot1 = [1, 2, 0, 0];
var rot2 = [2, 0, 1, 0];

//var ad1 = x => rot1[x&3];
//var ad2 = x => rot2[x&3];

var ad1 = function(x) {return rot1[x&3]};
var ad2 = function(x) {return rot2[x&3]};


var agd1 = function() {
	var r = [1,2,0,0];
	return x => r[x&3];
}();

var agd2 = () => {
	var r = [2,0,1,0];
	return x => r[x&3];
}();


var ard1 = function(x) {
	x&=3;
	return x==0 ? 1 : x==1 ? 2 : 0;
};
var ard2 = function(x) {
	x&=3;
	return x==0 ? 2 : x==1 ? 0 : 1;
};



console.time('a');
for(var k=0; k<500; k++) {
	for(var i=0; i<1000000; i++) {
		var a1 = add1(i);
		var a2 = add2(i);
	}
}
console.timeEnd('a');


console.time('b');
for(var k=0; k<500; k++) {
	for(var i=0; i<1000000; i++) {
		var a1 = ad1(i);
		var a2 = ad2(i);
	}
}
console.timeEnd('b');


console.time('c');
for(var k=0; k<500; k++) {
	for(var i=0; i<1000000; i++) {
		var a1 = agd1(i);
		var a2 = agd2(i);
	}
}
console.timeEnd('c');



console.time('d');
for(var k=0; k<500; k++) {
	for(var i=0; i<1000000; i++) {
		var a1 = ard1(i);
		var a2 = ard2(i);
	}
}
console.timeEnd('d');
