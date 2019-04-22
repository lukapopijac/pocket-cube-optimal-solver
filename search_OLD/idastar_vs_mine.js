/**
This file is a little bit chaotic. It is quickly written just to compare some
algorithms: IDA* and mine search algorithm for the all states of the cube.
*/
'use strict';
const fs = require('fs');
const CubeState = require('./cubestate');
const search = require('./search');
const searchIDAstar = require('./search_idastar');

let state = new CubeState(0b01101100, 0b00011101, 0b10100101, 0b0100010111010000);
let normalize = state.normalize();
search(state);
searchIDAstar(state);


function getCubeStatesAsKeys() {
	const path = require('path');
	const fileTable = require('./filetable');
	let cubeStatesFileName = 'cubestates-depth11.gz';
	let cubeStatesFilePath = path.join(path.join(__dirname, 'tables'), cubeStatesFileName);
	if(!fileTable.exists(cubeStatesFilePath)) {
		console.log('Full cube states table ' + '\x1b[1m' + cubeStatesFileName + '\x1b[0m' + ' not found.');
		require('./generatestates')();
	}

	process.stdout.write('Loading ' + '\x1b[1m' + cubeStatesFileName + '\x1b[0m' + '...');
	let d0 = Date.now();
	let table = fileTable.fromFile(cubeStatesFilePath, 'Map');
	let keys = table.keys();
	let d1 = Date.now();
	console.log('...done! (' + (d1-d0) + 'ms)');
	
	return keys;
}

function getAllCubeStates() {
	let keys = getCubeStatesAsKeys();
	let cubeStates = [];
	for(let key of keys) {
		let p2 = completeP(key>>12 & 63);
		let p1 = completeP(key>>6 & 63);
		let p0 = completeP(key & 63);
		
		let o = key>>18;
		let v = o - ((o&0b1010101010101010)>>1);
		let missingO = (30 - (v&3) - (v>>2&3) - (v>>4&3) - (v>>6&3) - (v>>8&3) - (v>>10&3)) % 3;
		if(missingO==0b10) missingO = 0b11;
		
		cubeStates.push(new CubeState(p2, p1, p0, o + (missingO<<12)));
	}
	return cubeStates;
}

function completeP(p) {
	let t = (p & 0b010101) + (p>>1 & 0b010101);
	let sum = (t&0b11) + (t>>2 & 0b11) + (t>>4 & 0b11);  // sum of bits
	return (sum==3 ? 0b10000000 : 0b11000000) + p;
}



function main() {
	let cubeStates = getAllCubeStates();
	//cubeStates = cubeStates.slice(70000, 70020);
	let n = cubeStates.length;
	
	let lens1 = [];  // solution lengths
	let lens2 = [];
	
	console.time('time');
	for(var i=0; i<n; i++) {
		let cubeState = cubeStates[i];
		
		let solution1 = searchIDAstar(cubeState);
		lens1.push(solution1.length);
		
		let solution2 = search(cubeState);
		lens2.push(solution2.length);
	}
	console.timeEnd('time');
	
	fs.writeFileSync('lens.txt', lens1);
	fs.writeFileSync('lens2.txt', lens2);
	
	let dist1 = [];
	for(let i=0; i<lens1.length; i++) {
		let v = lens1[i];
		if(dist1[v] == null) dist1[v] = 0;
		dist1[v]++;
	}
	
	let dist2 = [];
	for(let i=0; i<lens2.length; i++) {
		let v = lens2[i];
		if(dist2[v] == null) dist2[v] = 0;
		dist2[v]++;
	}
	
	fs.writeFileSync('distribution1.txt', dist1);
	fs.writeFileSync('distribution2.txt', dist2);
}

//main();


function getIndicesForHardestStates() {
	let indices = [];
	let s = fs.readFileSync('lens.txt'); // lens.txt should be generated first with main()
	let r = s.toString().split(',').map(x=>+x);
	for(let i=0; i<r.length; i++) {
		if(r[i]==11) indices.push(i);
	}
	return indices;
}


function main2() {
	let cubeStates = getAllCubeStates();
	let indices = getIndicesForHardestStates();
	let n = indices.length;
	
	console.time('time');
	for(var i=0; i<n; i++) {
		let cubeState = cubeStates[indices[i]];		
		let solution = search(cubeState);
		//let solution = searchIDAstar(cubeState);
	}
	console.timeEnd('time');
	console.log(n);
}


main2();


/*

mine
----
time: 453954.276ms
total 3674160
average moves 8.755576240555664


IDA*
----
time: 618528.963ms
total 3674160
average moves 8.755576240555664

*/

