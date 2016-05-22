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
	setSolution(null);
	stickers.forEach(function(el) {
		var o = getO(el);
		var p = getP(el);
		var v;
		if(o==0) v = p<4 ? 32 : 4;  // yellow=32, white=4
		else if(o==1) {
			if(p==3 || p==5) v = 1;  // blue
			if(p==2 || p==7) v = 2;  // orange
			if(p==1 || p==4) v = 8;  // red
			if(p==0 || p==6) v = 16; // green
		}
		else { // o==2
			if(p==1 || p==7) v = 1;
			if(p==3 || p==6) v = 2;
			if(p==0 || p==5) v = 8;
			if(p==2 || p==4) v = 16;
		}
		setV(el, v);
	});
});


document.querySelector('.button.empty').addEventListener('click', function(evt) {
	setSolution(null);
	stickers.forEach(el => setV(el, 0));
});


document.querySelector('.button.solve').addEventListener('click', function(evt) {
	setSolution(null);
	
	var p = stickers
		.reduce((acc, curr) => {
			acc[curr.getAttribute('data-p')] += +curr.getAttribute('data-v');
			return acc;
		}, [0,0,0,0,0,0,0,0])
		.map(x => x&0b111)
		.join('');
	
	var o = stickers
		.filter(x => x.getAttribute('data-v') & 0b100100)   // v==4 || v==32
		.reduce((acc, curr) => {
			acc[curr.getAttribute('data-p')] = +curr.getAttribute('data-o');
			return acc;
		}, [0,0,0,0,0,0,0,0])
		.join('');
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', encodeURI('/solve?p=' + p + '&o=' + o));
	xhr.onload = function() {
		switch(xhr.status) {
			case 200:
			case 304:
				var data = JSON.parse(xhr.responseText);
				setSolution(formulateSolution(data), false, isSolved(data));
				break;
			case 400:
				setSolution(xhr.responseText, true);
				break;
			default:
				setSolution('Some error occured!', true);
		}
	};
	xhr.onerror = function() {
		setSolution('Error! Check your internet connection', true);
	};
	xhr.send();
});

function isSolved(data) {
	return data.solution.length==0;
}

function formulateSolution(resData) {
	return resData.normalize
		.concat(resData.solution)
		.map(x => x[1]=='1' ? x[0] : x[1]=='3' ? x[0]+"'" : x)
		.join(' ');
}

function setSolution(text, isError, isSolved) {
	var solRow = document.querySelector('.solution-row');
	
	solRow.classList[text == null ? 'add' : 'remove']('hidden');
	solRow.classList[isError      ? 'add' : 'remove']('error');
	solRow.classList[isSolved     ? 'add' : 'remove']('solved');
	
	solRow.querySelector('.solution').textContent = isSolved ? 'Solved!' : text;
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