const fs = require('fs');

let s = fs.readFileSync('pdb-hash9.gz.json');
let a = JSON.parse(s);

console.log(a.length, a.slice(0, 20));

let sn = {
    0: 0, 1: 0, 2: 0, 3: 0, 
    4: 0, 5: 0, 6: 0, 7: 0,
    8: 0, 9: 0, 10: 0, 11: 0
};
let sum = 0;
for(let i=0; i<a.length; i++) {
    sn[a[i]]++;
    sum += a[i];
}

console.log('len', a.length);
console.log('avg', sum/a.length);
console.log(sn);
