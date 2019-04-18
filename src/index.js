var stickers = Array.from(document.querySelectorAll('.sticker'));
var colorPicks = Array.from(document.querySelectorAll('.color-pick'));


// set click handler on each sticker
stickers.forEach(function(el) {
	el.addEventListener('click', function(evt) {
		setSolution(null);
		var v = document.querySelector('.color-pick.selected').getAttribute('data-v');
		evt.target.setAttribute('data-v', v);
	});
});

// set click handler on each colorPick
colorPicks.forEach(function(el) {
	el.addEventListener('click', function(evt) {
		document.querySelector('.color-pick.selected').classList.remove('selected');
		evt.target.classList.add('selected');
	});
});

// set click handler on button 'reset'
document.querySelector('.button.reset').addEventListener('click', function(evt) {
	setSolution(null);
	stickers.forEach(function(el) {
		var o = +el.getAttribute('data-o');
		var p = +el.getAttribute('data-p');
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
		el.setAttribute('data-v', v);
	});
});

// set click handler on button 'empty'
document.querySelector('.button.empty').addEventListener('click', function(evt) {
	setSolution(null);
	stickers.forEach(el => el.setAttribute('data-v', 0));
});

// set click handler on button 'solve'
document.querySelector('.button.solve').addEventListener('click', function(evt) {
	if(validateState()) {
		setSolution('Impossible state!', true);
		return;
	}
	
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
				setSolution('Impossible state!', true);
				break;
			default:
				setSolution('Some error occurred!', true);
		}
	};
	xhr.onerror = function() {
		setSolution('Error! Check your internet connection', true);
	};
	xhr.send();
});


function validateState() {
	var s = stickers.map(x => ({
		p: +x.getAttribute('data-p'),
		o: +x.getAttribute('data-o'),
		v: +x.getAttribute('data-v')
	}));
	
	// check if any color exists on two stickers on the same cubie
	var t = s.reduce((a,x) => {
		if(!a || x.v&a[x.p]) return null;
		a[x.p] += x.v;
		return a;
	}, [0,0,0,0,0,0,0,0]);
	if(t==null) return true;
	
	// check if two opposite colors exist on the same cubie (yellow-white=36, green-blue=17, red-orange=10)
	if(t.some(x => (x&36)==36 || (x&17)==17 || (x&10)==10)) return true;
	
	// check if any color exists on more than 4 stickers
	t = s.filter(x => x.v!=0)
		.map(x => x.v<8 ? x.v>>1 : (x.v>>4)+3)   // map {1,2,4,8,16,32} to {0,1,2,3,4,5}
		.reduce((a,x) => {
			if(!a || a[x]==4) return null;
			a[x]++;
			return a;
		}, [0,0,0,0,0,0]);
	if(t==null) return true;
	
	// TODO: check if any cubie is illegal (e.g. swapping two colors on it makes cubie illegal)
}

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
