var bson = require('bson');
var BSON = new bson.BSONPure.BSON();

var fs = require('fs');
var table = BSON.deserialize(fs.readFileSync('table.bin'));

//console.log(table);
console.log(Object.keys(table).length);
