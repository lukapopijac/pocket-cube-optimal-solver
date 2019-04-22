let a = [
	1,0,0,1,0,1,1,1,
	0,0,0,1,0,0,0,0,
	1,1,0,1,1,1,1,0,
	0,0,1,0,1,1
];

let n = Math.ceil(a.length/8);

let b = new Uint8Array(n);

console.log(n);

for(let i=0; i<n; i++) {
	let x = a.slice(8*i, 8*(i+1));
	while(x.length<8) x.push(0);  // for the last byte
	b[i] = parseInt(x.join(''), 2);
}

console.log(b);

let c = [];
c.length = 8*b.length;
for(let i=0; i<b.length; i++) {
	let x = ('00000000' + b[i].toString(2)).slice(-8); // take binary and pad with zeros
	for(let j=0; j<8; j++) c[8*i+j] = +x[j];
}
c.length = a.length;
console.log(a);
console.log(c);

