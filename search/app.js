'use strict';
const express = require('express');
const router = express.Router();

const CubeState = require('./cubestate');
const search = require('./search');

router.route('/solve')
	.get(function(req, res, next) {
		if(false) res.status(400).send('Impossible state!');
		else next();
	})
	.get(function(req, res) {
		let pa = req.query.p.split('').map(x => +x);
		let p2 = pa.reduce((a,x,i) => a+(x&0b100?1<<i:0), 0);
		let p1 = pa.reduce((a,x,i) => a+(x&0b010?1<<i:0), 0);
		let p0 = pa.reduce((a,x,i) => a+(x&0b001?1<<i:0), 0);
		let o = req.query.o.split('').map(x=>x<2?+x:3).reduce((a,x,i) => a+(x<<2*i), 0);
		
		let state = new CubeState(p2, p1, p0, o);
		let normalize = state.normalize();
		let solution = search(state);
		res.json({normalize, solution});
	})
;

module.exports = router;
