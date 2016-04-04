'use strict';
const express = require('express');
const router = express.Router();

const CubeState = require('./cubestate');
const search = require('./search');

router.route('/cube2')
	.get(function(req, res) {
		//let state = new CubeState(0b01101100, 0b00011101, 0b10100101, 0b0100010111010000);
		let state = new CubeState(+req.query.p2, +req.query.p1, +req.query.p0, +req.query.o);
		let normalize = state.normalize();
		let solution = search(state);
		res.json({normalize, solution});
	})
;

module.exports = router;

/*
http://localhost:3000/cube2?p2=0b01101100&p1=0b00011101&p0=0b10100101&o=0b0100010111010000
*/