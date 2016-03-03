var fs = require('fs');
var zlib = require('zlib');

function readTable(filename) {
	if(!filename) filename = 'table11.gz';
	return new Promise(function(resolve, reject) {
		zlib.inflate(fs.readFileSync(filename), (err, buffer) => {
			if(err) return reject(err);
			
			var table = JSON.parse(buffer.toString());
		
			//var keys = Object.keys(table);
			//for(var i=0; i<10; i++) {
			//	console.log(keys[i], table[keys[i]]);
			//}	
			//console.log(keys.length);
			
			return resolve(table);
		});
	});
};


module.exports = readTable;
