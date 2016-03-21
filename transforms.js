'use strict';

let transP = {
	U1: new Uint8Array(241), U2: new Uint8Array(241), U3: new Uint8Array(241),
	F1: new Uint8Array(241), F2: new Uint8Array(241), F3: new Uint8Array(241),
	R1: new Uint8Array(241), R2: new Uint8Array(241), R3: new Uint8Array(241),
	x1: new Uint8Array(241), x2: new Uint8Array(241), x3: new Uint8Array(241),
	y1: new Uint8Array(241), y2: new Uint8Array(241), y3: new Uint8Array(241),
	z1: new Uint8Array(241), z2: new Uint8Array(241), z3: new Uint8Array(241)
};

let transO = {
	U1: new Uint16Array(65536), U2: new Uint16Array(65536), U3: new Uint16Array(65536),
	F1: new Uint16Array(65536), F2: new Uint16Array(65536), F3: new Uint16Array(65536),
	R1: new Uint16Array(65536), R2: new Uint16Array(65536), R3: new Uint16Array(65536),
	x1: new Uint16Array(65536), x2: new Uint16Array(65536), x3: new Uint16Array(65536),
	y1: new Uint16Array(65536), y2: new Uint16Array(65536), y3: new Uint16Array(65536),
	z1: new Uint16Array(65536), z2: new Uint16Array(65536), z3: new Uint16Array(65536)
};


let pMatrix = {
	U1: [2,0,3,1,4,5,6,7], U2: [3,2,1,0,4,5,6,7], U3: [1,3,0,2,4,5,6,7],
	F1: [1,5,2,3,0,4,6,7], F2: [5,4,2,3,1,0,6,7], F3: [4,0,2,3,5,1,6,7],
	R1: [4,1,0,3,6,5,2,7], R2: [6,1,4,3,2,5,0,7], R3: [2,1,6,3,0,5,4,7],
	x1: [4,5,0,1,6,7,2,3], x2: [6,7,4,5,2,3,0,1], x3: [2,3,6,7,0,1,4,5],
	y1: [2,0,3,1,6,4,7,5], y2: [3,2,1,0,7,6,5,4], y3: [1,3,0,2,5,7,4,6],
	z1: [1,5,3,7,0,4,2,6], z2: [5,4,7,6,1,0,3,2], z3: [4,0,6,2,5,1,7,3]
};

let oMatrix = {
	U1: [0,0,0,0,0,0,0,0], U2: [0,0,0,0,0,0,0,0], U3: [0,0,0,0,0,0,0,0],
	F1: [1,2,0,0,2,1,0,0], F2: [0,0,0,0,0,0,0,0], F3: [1,2,0,0,2,1,0,0],
	R1: [2,0,1,0,1,0,2,0], R2: [0,0,0,0,0,0,0,0], R3: [2,0,1,0,1,0,2,0],
	x1: [2,1,1,2,1,2,2,1], x2: [0,0,0,0,0,0,0,0], x3: [2,1,1,2,1,2,2,1],
	y1: [0,0,0,0,0,0,0,0], y2: [0,0,0,0,0,0,0,0], y3: [0,0,0,0,0,0,0,0],
	z1: [1,2,2,1,2,1,1,2], z2: [0,0,0,0,0,0,0,0], z3: [1,2,2,1,2,1,1,2]
};

let moves = [
	'U1', 'U2', 'U3', 'F1', 'F2', 'F3', 'R1', 'R2', 'R3',
	'x1', 'x2', 'x3', 'y1', 'y2', 'y3', 'z1', 'z2', 'z3'
];


function generatePTransforms() {
	for(let i0=0; i0<5; i0++) {
		for(let i1=i0+1; i1<6; i1++) {
			for(let i2=i1+1; i2<7; i2++) {
				for(let i3=i2+1; i3<8; i3++) {
					let p = 1<<i0 | 1<<i1 | 1<<i2 | 1<<i3;
					
					for(let move of moves) {
						let nextP = p;
						for(let i=0; i<8; i++) {
							if(1<<pMatrix[move][i] & p) nextP|=1<<i; else nextP&=~(1<<i);
						}
						
						transP[move][p] = nextP;						
					}
				}
			}
		}
	}
}

function generateOTransforms() {
	let is = [0,1,2];	
	for(let i0 of is) {
		for(let i1 of is) {
			for(let i2 of is) {
				for(let i3 of is) {
					for(let i4 of is) {
						for(let i5 of is) {
							for(let i6 of is) {
								let i7 = (30-i0-i1-i2-i3-i4-i5-i6) % 3;
								let o = (i0*3>>1)<<0 | (i1*3>>1)<<2  | (i2*3>>1)<<4  | (i3*3>>1)<<6 |
								        (i4*3>>1)<<8 | (i5*3>>1)<<10 | (i6*3>>1)<<12 | (i7*3>>1)<<14;
								let nextO = 0;
								
								for(let move of moves) {
									for(let i=0; i<8; i++) {
										let v = o>>2*pMatrix[move][i] & 0b11;
										let nextV = v;
										let step = oMatrix[move][i];
										if(step==1) nextV = 5*v+2>>1&3;
										if(step==2) nextV = v+7>>1&3;									
										nextO |= nextV<<2*i;
									}
									
									transO[move][o] = nextO;						
								}
							}
						}
					}
				}
			}
		}
	}
}

generatePTransforms();
generateOTransforms();

module.exports = {p: transP, o: transO};
