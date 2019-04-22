let base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';



function to64(a) {
    let b = [];
    b.length = a.length>>1;
    for(let i=0; i<b.length; i++) {
        b[i] = base[parseInt('' + a[2*i] + a[2*i+1], 8)];
    }
    return b.join('');
}

function from64(s) {
    let a = [];
    a.length = 2*s.length;
    for(let i=0; i<s.length; i++) {
        let o = base.indexOf(s[i]);
        a[2*i] = o>>3;
        a[2*i+1] = o&0b111;
    }
    return a;
}



let baseArray = base.split('');
console.log(baseArray.length);

function to64_a(a) {
    let b = [];
    b.length = a.length>>1;
    for(let i=0; i<b.length; i++) {
        b[i] = baseArray[parseInt('' + a[2*i] + a[2*i+1], 8)];
    }
    return b.join('');
}

let baseMap = {};
for(let i=0; i<base.length; i++) {
    baseMap[base[i]] = i;
}

function from64_a(s) {
    let a = [];
    a.length = 2*s.length;
    for(let i=0; i<s.length; i++) {
        let o = baseMap[s[i]];
        a[2*i] = o>>3;
        a[2*i+1] = o&0b111;
    }
    return a;
}



// const fs = require('fs');
// let s = fs.readFileSync('pdb-hash5.gz.json');
// let a = JSON.parse(s);
// a = clean(a);

let a = randomArray(100000);

// let a = [3,5,7,1,3,2,2,7,4,0,2,6,5,6];
console.log('a', a.slice(0, 20));

let b = to64_a(a);
console.log('b', b.slice(0, 20));

let c = from64_a(b);
console.log('c', c.slice(0, 20));

console.log(a.length);


function randomArray(n) {
    let a = [];
    a.length = n;
    for(let i=0; i<n; i++) {
        a[i] = Math.random()*8 | 0;
    }
    return a;
}

function clean(a) {
    for(let i=0; i<a.length; i++) {
        if(a[i]>7) a[i]=7;
    }
    return a;
}


a = to64(a);
let n = 100;

console.time('base');
for(let j=0; j<n; j++) b = from64(a);
console.timeEnd('base');
console.log(b.slice(0, 20));

console.time('base_a');
for(let j=0; j<n; j++) b = from64_a(a);
console.timeEnd('base_a');
console.log(b.slice(0, 20));

