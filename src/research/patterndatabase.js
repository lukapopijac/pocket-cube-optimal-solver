const fs = require('fs');
const path = require('path');
const fileTable = require('./filetable');
const hashes = require('../hashes.js');

const tablesDir = path.join(__dirname, 'tables');

function generateTable(hashId, allowedValues) {
	let cubeStatesFileName = 'cubestates-depth11.gz';
	let cubeStatesFilePath = path.join(tablesDir, cubeStatesFileName);
	
	// create full-depth all-states table if it doesn't exist
	if(!fileTable.exists(cubeStatesFilePath)) {
		console.log('Full cube states table ' + '\x1b[1m' + cubeStatesFileName + '\x1b[0m' + ' not found.');
		require('./generatestates')();
	}
	
	// load full-depth all-states table
	process.stdout.write('Loading ' + '\x1b[1m' + cubeStatesFileName + '\x1b[0m' + '...');
	let d0 = Date.now();
	let table = fileTable.fromFile(cubeStatesFilePath, 'Map');
	let keys = table.keys();
	let d1 = Date.now();
	console.log('...done! (' + (d1-d0) + 'ms)');
	
	let fileName = allowedValues.length<12 ? 
		`pdb-${hashId}-${allowedValues.join('_')}.json`:
		`pdb-${hashId}.json`
	;
	process.stdout.write('Generating ' + '\x1b[1m' + fileName + '\x1b[0m' + '...');
	d0 = Date.now();
	
	let hash = hashes[hashId];
	let patternDB = [];

	// prepare mappedValues
	let mappedValues = [];
	let j = 0;
	for(let v=0; v<=11; v++) {
		if(v==allowedValues[j+1]) j++;
		mappedValues[v] = allowedValues[j];
	}

	// fill patternDB with values
	for(let key of keys) {  // key represents state
		// Following are not really p2, p1, p0, o, just their lower 6 bits.
		// Higher 2 bits are not important as they are not used for hashing.
		let idx = hash({
			p2: key>>12 & 63,
			p1: key>>6 & 63,
			p0: key & 63,
			o: key>>18
		});
		let val = mappedValues[table.get(key)];
		if(patternDB[idx] == undefined || val < patternDB[idx]) patternDB[idx] = val;
	}

	// fill undefined slots (if any) with max allowed value
	let maxVal = allowedValues[allowedValues.length-1];
	let cnt = 0;
	for(let i=0; i<patternDB.length; i++) if(patternDB[i] == undefined) {
		cnt++;
		patternDB[i] = maxVal;
	}
	if(cnt>0) console.warn(`There are ${cnt} empty slots in pattern db.`);


	d1 = Date.now();
	console.log('...done! (' + (d1-d0) + 'ms)');
	
	// write to file
	writeToFile(path.join(tablesDir, fileName), hashId, patternDB, allowedValues);
}

function writeToFile(filePath, hashId, patternDB, allowedValues) {
	let s = JSON.stringify(
		{hashId, allowedValues, ...getStats(patternDB), patternDB},
		(k, v) => Array.isArray(v) ? JSON.stringify(v) : v,  // print arrays in one line
		'\t'
	);
	s = s.replace(/\"\[/g, '[').replace(/\]\"/g, ']');  // fix arrays (remove quotes)

	fs.writeFileSync(filePath, s);
}


function getStats(patternDB) {
	let distribution = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0};
	let sum = 0;
	for(let i=0; i<patternDB.length; i++) {
		distribution[patternDB[i]]++;
		sum += patternDB[i];
	}
	return {
		size: patternDB.length,
		average: sum/patternDB.length,
		distribution
	};
}

module.exports = {
	getTable: function(pdbFile) {
		let fileName = 'pdb-' + hashId + '.gz';
		let filePath = path.join(tablesDir, fileName);
		if(!fileTable.exists(filePath)) {
			console.log('Pattern database ' + '\x1b[1m' + fileName + '\x1b[0m' + ' not found.');
			generateTable(hashId);
		}
		let patternDB = fileTable.fromFile(filePath, 'Uint8Array');
		let hash = hashes[hashId];
		return cubeState => patternDB[hash(cubeState)];
	}
};


// if called with parameters, examples:
// node patterndatabase.js hash7
// node patterndatabase.js hash7 0,5,6,7
let hashId = process.argv[2];
if(hashId) {
	if(!hashes[hashId]) {
		console.warn(`hash '${hashId}' does not exist.`);
		process.exit();
	}
	let allowedValues = process.argv[3];

	allowedValues = allowedValues ?
		allowedValues.split(',').map(x => +x).sort((a,b) => a-b) :
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	;

	if(allowedValues[0] != 0) {
		console.warn('Zero must be allowed value.');
		process.exit();
	}

	generateTable(hashId, allowedValues);
}
