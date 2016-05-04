var stickers = Array.from(document.querySelectorAll('.sticker'));
var colorPicks = Array.from(document.querySelectorAll('.color-pick'));

function setV(el, v) {
	el.setAttribute('data-v', v);
}
function getP(el) {
	return +el.getAttribute('data-p');
}
function getO(el) {
	return +el.getAttribute('data-o');
}

stickers.forEach(function(el) {
	el.addEventListener('click', function(evt) {
		var v = document.querySelector('.color-pick.selected').getAttribute('data-v');
		setV(evt.target, v);
	});
});

colorPicks.forEach(function(el) {
	el.addEventListener('click', function(evt) {
		document.querySelector('.color-pick.selected').classList.remove('selected');
		evt.target.classList.add('selected');
	});
});

document.querySelector('.button.reset').addEventListener('click', function(evt) {
	stickers.filter(x => getP(x)<4 && getO(x)==0).forEach(el => setV(el, 32)); // yellow
	stickers.filter(x => getP(x)>3 && getO(x)==0).forEach(el => setV(el, 4));  // white
	stickers.filter(x => !(getP(x)&1) && getO(x)).forEach(el => setV(el, 16));  // green
	stickers.filter(x => getP(x)&1 && getO(x)).forEach(el => setV(el, 1));  // blue
	
});

document.querySelector('.button.clear').addEventListener('click', function(evt) {
	stickers.forEach(el => setV(el, 0));
});


function getPArray() {
	return stickers
		.reduce((acc, curr) => {
			acc[curr.getAttribute('data-p')] += +curr.getAttribute('data-v');
			return acc;
		}, [0,0,0,0,0,0,0,0])
		.map(x => x&0b111);
}

function getOArray() {
	return stickers
		.filter(x => x.getAttribute('data-v') & 0b100100)   // v==4 || v==32
		.reduce((acc, curr) => {
			acc[curr.getAttribute('data-p')] = +curr.getAttribute('data-o');
			return acc;
		}, [0,0,0,0,0,0,0,0]);
}



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