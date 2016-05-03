var stickers = Array.from(document.querySelectorAll('svg [data-p]'));

console.log(stickers);


var pa = stickers
    .reduce((acc, curr) => {
        acc[curr.getAttribute('data-p')] += +curr.getAttribute('data-v');
        return acc;
    }, [0,0,0,0,0,0,0,0])
    .map(x => x&0b111);


var oa = stickers
    .filter(x => x.getAttribute('data-v') & 0b100100)   // v==4 || v==32
    .reduce((acc, curr) => {
        acc[curr.getAttribute('data-p')] = +curr.getAttribute('data-o');
        return acc;
    }, [0,0,0,0,0,0,0,0]);
	

console.log(pa);
console.log(oa);
	
/*

// generate p array

stickers
    .sort((a,b) => a.dataset.p-b.dataset.p)
    .map(x => x.dataset.v)
    .reduce((acc, curr, i, arr)=>{
        if(i%3==0) acc.push((curr + arr[i+1] + arr[i+2]) & 0b111);
        return acc;
    }, [])


stickers
    .reduce((acc, curr) => {
        acc[curr.dataset.p] += curr.dateset.v;
        return acc;
    }, [0,0,0,0,0,0,0,0])
    .map(x => x&0b111);


// generate o array

document.querySelectorAll('[data-v=4],[data-v=8]')
    .sort((a,b) => a.dataset.p-b.dataset.p)
    .map(x => x.dataset.o)


// or starting the same as for `p` array:

stickers
    .sort((a,b) => a.dataset.p-b.dataset.p)
    .filter(x => x.dataset.v & 0b1100)   // v==4 || v==8
    .map(x => x.dataset.o)


// or

stickers
    .filter(x => x.dataset.v & 0b1100)   // v==4 || v==8
    .reduce((acc, curr) => {
        acc[curr.dataset.p] = curr.dataset.o;
        return accl
    }, [0,0,0,0,0,0,0,0]);



var p2 = p.reduce((acc, curr, i) => curr&0b100 ? acc + (1<<i) : acc, 0);
var p1 = p.reduce((acc, curr, i) => curr&0b010 ? acc + (1<<i) : acc, 0);
var p0 = p.reduce((acc, curr, i) => curr&0b001 ? acc + (1<<i) : acc, 0);
var p0 = p.reduce((acc, curr, i) => acc + (curr&0b001 ? 1<<i : 0), 0);

p.reduce((acc, curr, i) => {
    var b = 1<<i;
    if(curr&0b100) acc[2] += b;
    if(curr&0b010) acc[1] += b;
    if(curr&0b001) acc[0] += b;
    return acc;
}, [0,0,0]);

o.reduce((acc, curr, i) => acc + (curr==2 ? 0b11<<2*i : curr<<2*i), 0);
o.reduce((acc, curr, i) => acc + (curr==2 ? 0b11 : curr)<<2*i, 0);

o.map(x=>x<2?x:3).reduce((a,x,i) => a+(x<<2*i), 0);


*/