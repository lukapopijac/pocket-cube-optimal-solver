function State(p, o, prevState, lastMove) {
	this.p = p || parseInt('000001010011100101110111', 2);  // solved permutation (3 bits per cubie)
	this.o = o || parseInt('0000000000000000', 2);          // solved orientation (2 bits per cubie)
	this.prevState = prevState || null;
	this.lastMove = lastMove || null;
	this.normalizedStep = null;
}


/** Generates new State instance
*/
State.prototype.generateNextState = function() {
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
	
	var pu = parseInt('000000000000111111111111', 2);  // cubies not in U layer
	var pf = parseInt('000000111111000000111111', 2);  // cubies not in F layer
	var pr = parseInt('000111000111000111000111', 2);  // cubies not in R layer
	
	var ou = parseInt('0000000011111111', 2);
	var of = parseInt('0000111100001111', 2);
	var or = parseInt('0011001100110011', 2);
	
	var add1 = function(x) {x&=3; return x==2 ? 0 : x+1};  // add 1 mod 3 on last 2 bits
	var add2 = function(x) {x&=3; return x==0 ? 2 : x-1};  // add 2 mod 3 on last 2 bits
	
	return function(move) {
		var sp = this.p;
		var so = this.o;
		var p = 0;
		var o = 0;
		
		switch(move) {
			case 'U1': //    0 > 1      1 > 3      3 > 2      2 > 0
				p = sp&pu | sp>>3&p1 | sp>>6&p3 | sp<<3&p2 | sp<<6&p0;
				o = so&ou | so>>2&o1 | so>>4&o3 | so<<2&o2 | so<<4&o0;
				break;
			case 'U2': //    0 > 3      3 > 0      1 > 2      2 > 1
				p = sp&pu | sp>>9&p3 | sp<<9&p0 | sp>>3&p2 | sp<<3&p1;
				o = so&ou | so>>6&o3 | so<<6&o0 | so>>2&o2 | so<<2&o1;
				break;
			case 'U3': //    0 > 2      2 > 3      3 > 1      1 > 0
				p = sp&pu | sp>>6&p2 | sp>>3&p3 | sp<<6&p1 | sp<<3&p0;
				o = so&ou | so>>4&o2 | so>>2&o3 | so<<4&o1 | so<<2&o0;
				break;
			case 'F1': //    0 > 4       4 > 5      5 > 1       1 > 0
				p = sp&pf | sp>>12&p4 | sp>>3&p5 | sp<<12&p1 | sp<<3&p0;
				o = so&of | add2(so>>14)<<6 | add1(so>>6)<<4 | add2(so>>4)<<12 | add1(so>>12)<<14;
				break;
			case 'F2': //    0 > 5       5 > 0       1 > 4      4 > 1
				p = sp&pf | sp>>15&p5 | sp<<15&p0 | sp>>9&p4 | sp<<9&p1;
				o = so&of | so>>10&o5 | so<<10&o0 | so>>6&o4 | so<<6&o1;
				break;
			case 'F3': //    0 > 1      1 > 5       5 > 4      4 > 0
				p = sp&pf | sp>>3&p1 | sp>>12&p5 | sp<<3&p4 | sp<<12&p0;
				o = so&of | add2(so>>14)<<12 | add1(so>>12)<<4 | add2(so>>4)<<6 | add1(so>>6)<<14;
				break;
			case 'R1': //    0 > 2      2 > 6       6 > 4      4 > 0
				p = sp&pr | sp>>6&p2 | sp>>12&p6 | sp<<6&p4 | sp<<12&p0;
				o = so&of | add1(so>>14)<<10 | add2(so>>10)<<2 | add1(so>>2)<<6 | add2(so>>6)<<14;
				break;
			case 'R2': //    0 > 6       6 > 0       2 > 4      4 > 2
				p = sp&pr | sp>>18&p6 | sp<<18&p0 | sp>>6&p4 | sp<<6&p2;
				o = so&of | so>>12&o6 | so<<12&o0 | so>>4&o4 | so<<4&o2;
				break;
			case 'R3': //    0 > 4       4 > 6      6 > 2       2 > 0
				p = sp&pr | sp>>12&p4 | sp>>6&p6 | sp<<12&p2 | sp<<6&p0;
				o = so&of | add1(so>>14)<<6 | add2(so>>6)<<2 | add1(so>>2)<<10 | add2(so>>10)<<14;
				break;
			case 'y1'://0>1      1>3      3>2      2>0      4>5      5>7      7>6      6>4
				p =   sp>>3&p1|sp>>6&p3|sp<<3&p2|sp<<6&p0|sp>>3&p5|sp>>6&p7|sp<<3&p6|sp<<6&p4
				//o = so&ou | so>>2&o1 | so>>4&o3 | so<<2&o2 | so<<4&o0;
				break;				
		}
		
		return new State(p, o, this, move);
	}
}();


State.prototype.toString = function() {
	var ps = (this.p+(1<<24)).toString(2).slice(1).match(/.{3}/g).map(x=>parseInt(x,2));
	var os = (this.o+(1<<16)).toString(2).slice(1).match(/.{2}/g).map(x=>parseInt(x,2));
	return '+ ' + ps + ' +' + '\n' + 
	       '+ ' + os + ' +';
};


State.prototype.isSolved = function() {
	return this.p == parseInt('000001010011100101110111', 2) &&
	       this.o == parseInt('0000000000000000', 2);
};


/** Rotate cube so cubie 7 is in its right place.
    Save this normalization step in `normalizedStep`
*/
State.prototype.normalize = function() {
	
};
