/** This file is not used in the application
*/
'use strict';

function lehmerCode(perm) { // n = 7
	let ret = [0,0,0,0,0,0,0];
	let s = 0;
	for(let i=0; i<7-1; i++) {  // the last one must be 0, so it is not needed to calculate
		let p = perm[i];
		ret[i] = p - (s>>3*p & 0b111);
		s += ( (1<<3*7)-(1<<3*p) ) /7;
	}
	return ret;
}

function* generatePermutation() {
	for(var i0=0; i0<7; i0++) {
		for(var i1=0; i1<7; i1++) {
			if(i1==i0) continue;
			for(var i2=0; i2<7; i2++) {
				if(i2==i0 || i2==i1) continue;
				for(var i3=0; i3<7; i3++) {
					if(i3==i0 || i3==i1 || i3==i2) continue;
					for(var i4=0; i4<7; i4++) {
						if(i4==i0 || i4==i1 || i4==i2 || i4==i3) continue;
						for(var i5=0; i5<7; i5++) {
							if(i5==i0 || i5==i1 || i5==i2 || i5==i3 || i5==i4) continue;
							for(var i6=0; i6<7; i6++) {
								if(i6==i0 || i6==i1 || i6==i2 || i6==i3 || i6==i4 || i6==i5) continue;
								yield [i0,i1,i2,i3,i4,i5,i6];
							}
						}
					}
				}
			}
		}
	}
}


function main() {
	for(let p of generatePermutation()) {
		console.log(p, lehmerCode(p));
	}
}

main();