/*   _.-'-._
 _.-'-._3_.-'-._      U - up
|-._ _.-U-._ _.-|     F - front
| 1 |-._ _.-| 2 |     R - right
|-._F   0   R_.-|     L - left
| 5 |-._|_.-| 6 |     B - back
'-._|   |   |_.-'     D - down
    '-._4_.-'
*/


var state = {
	p: parseInt('000001010011100101110111', 2),  // solved permutation (3 bits per cubie)
	o: parseInt('0000000000000000', 2);          // solved orientation (2 bits per cubie)
};

var move = function() {
	var p0 = parseInt('111000000000000000000000', 2);
	var p1 = parseInt('000111000000000000000000', 2);
	var p2 = parseInt('000000111000000000000000', 2);
	var p3 = parseInt('000000000111000000000000', 2);
	var p4 = parseInt('000000000000111000000000', 2);
	var p5 = parseInt('000000000000000111000000', 2);
	var p6 = parseInt('000000000000000000111000', 2);
	var p7 = parseInt('000000000000000000000111', 2);
	
	var o0 = parseInt('1100000000000000', 2);
	var o1 = parseInt('0011000000000000', 2);
	var o2 = parseInt('0000110000000000', 2);
	var o3 = parseInt('0000001100000000', 2);
	var o4 = parseInt('0000000011000000', 2);
	var o5 = parseInt('0000000000110000', 2);
	var o6 = parseInt('0000000000001100', 2);
	var o7 = parseInt('0000000000000011', 2);
	
	var pu = parseInt('000000000000111111111111', 2);  // cubies not on U layer
	var pf = parseInt('000000111111000000111111', 2);  // cubies not on F layer
	var pr = parseInt('000111000111000111000111', 2);
	//var pl = parseInt('111000111000111000111000', 2);
	//var pb = parseInt('111111000000111111000000', 2);
	//var pd = parseInt('111111111111000000000000', 2);

	var ou = parseInt('0000000011111111', 2);
	var of = parseInt('0000111100001111', 2);
	var or = parseInt('0011001100110011', 2);
	//var ol = parseInt('1100110011001100', 2);
	//var ob = parseInt('1111000011110000', 2);
	//var od = parseInt('1111111100000000', 2);
	
	var add1 = function(x) {x&=3; return x==2 ? 0 : x-2};  // add 1 mod 3 on last 2 bits
	var add2 = function(x) {x&=3; return x==0 ? 2 : x-1};  // add 2 mod 3 on last 2 bits
	
	return {
		u1: function(s) { // 0 > 1       1 > 3       3 > 2       2 > 0
			s.p = s.p&pu | s.p>>3&p1 | s.p>>6&p3 | s.p<<3&p2 | s.p<<6&p0;
			s.o = s.o&ou | s.o>>2&o1 | s.o>>4&o3 | s.o<<2&o2 | s.o<<4&o0;
		},
		u2: function(s) { // 0 > 3       3 > 0       1 > 2       2 > 1
			s.p = s.p&pu | s.p>>9&p3 | s.p<<9&p0 | s.p>>3&p2 | s.p<<3&p1;
			s.o = s.o&ou | s.o>>6&o3 | s.o<<6&o0 | s.o>>2&o2 | s.o<<2&o1;
		},
		u3: function(s) { // 0 > 2       2 > 3       3 > 1       1 > 0
			s.p = s.p&pu | s.p>>6&p2 | s.p>>3&p3 | s.p<<6&p1 | s.p<<3&p0;
			s.o = s.o&ou | s.o>>4&o2 | s.o>>2&o3 | s.o<<4&o1 | s.o<<2&o0;
		},
		f1: function(s) { // 0 > 4        4 > 5       5 > 1        1 > 0
			s.p = s.p&pf | s.p>>12&p4 | s.p>>3&p5 | s.p<<12&p1 | s.p<<3&p0;
			s.o = s.o&of | add2(s.o>>14)<<6 | add1(s.o>>6)<<4 | add2(s.o>>4)<<12 | add1(s.o>>12)<<14;
		},
		f2: function(s) { // 0 > 5        5 > 0        1 > 4       4 > 1
			s.p = s.p&pf | s.p>>15&p5 | s.p<<15&p0 | s.p>>9&p4 | s.p<<9&p1;
			s.o = s.o&of | s.o>>10&o5 | s.o<<10&o0 | s.o>>6&o4 | s.o<<6&o1;
		},
		f3: function(s) { // 0 > 1       1 > 5        5 > 4       4 > 0
			s.p = s.p&pf | s.p>>3&p1 | s.p>>12&p5 | s.p<<3&p4 | s.p<<12&p0;
			s.o = s.o&of | add2(s.o>>14)<<12 | add1(s.o>>12)<<4 | add2(s.o>>4)<<6 | add1(s.o>>6)<<14;
		},
		r1: function(s) { // 0 > 2       2 > 6        6 > 4       4 > 0
			s.p = s.p&pr | s.p>>6&p2 | s.p>>12&p6 | s.p<<6&p4 | s.p<<12&p0;
			s.o = s.o&of | add1(s.o>>14)<<10 | add2(s.o>>10)<<2 | add1(s.o>>2)<<6 | add2(s.o>>6)<<14;
		},
		r2: function(s) { // 0 > 6        6 > 0        2 > 4       4 > 2
			s.p = s.p&pr | s.p>>18&p6 | s.p<<18&p0 | s.p>>6&p4 | s.p<<6&p2;
			s.o = s.o&of | s.o>>12&o6 | s.o<<12&o0 | s.o>>4&o4 | s.o<<4&o2;
		},
		r3: function(s) { // 0 > 4        4 > 6        6 > 2       2 > 0
			s.p = s.p&pr | s.p>>12&p4 | s.p>>6&p6 | s.p<<12&p2 | s.p<<6&p0;
			s.o = s.o&of | add1(s.o>>14)<<6 | add2(s.o>>6)<<2 | add1(s.o>>2)<<10 | add2(s.o>>10)<<14;
		}
	}
}();
