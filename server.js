'use strict';
const express = require('express');
const morgan = require('morgan');
const publicDir = require('path').join(__dirname, 'public');
const port = process.env.PORT || 3000;

let app = express();

app.use(morgan('dev'));
app.use(express.static(publicDir));

app.use(require('./search/app'));

app.listen(port, function() {
	console.log('server started at port', port);
});
