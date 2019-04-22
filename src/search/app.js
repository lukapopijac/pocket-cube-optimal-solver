'use strict';
const express = require('express');
const router = express.Router();

const CubeState = require('./cubestate');
const search = require('./search');

function validate(req) {
	let p = req.query.p ? req.query.p.split('') : '';
	if(	p.length != 8 ||
		p.some(x => isNaN(x) || x>7) ||
		p.reduce((a,x) => a+(1<<x), 0) != 0b11111111
	) return 'Parameter `p` invalid';
	
	let o = req.query.o ? req.query.o.split('') : '';
	if(	o.length != 8 ||
		o.some(x => isNaN(x) || x>2) ||
		o.reduce((a,x) => +x+a, 0) % 3 != 0
	) return 'Parameter `o` invalid';	
}

router.route('/solve')
	.get(function(req, res, next) {
		let validateMessage = validate(req);
		if(validateMessage) res.status(400).send(validateMessage);
		else next();
	})
	.get(function(req, res) {
		let p = req.query.p.split('').map(x => +x);
		let p2 = p.reduce((a,x,i) => a+(x&0b100?1<<i:0), 0);
		let p1 = p.reduce((a,x,i) => a+(x&0b010?1<<i:0), 0);
		let p0 = p.reduce((a,x,i) => a+(x&0b001?1<<i:0), 0);
		let o = req.query.o.split('').map(x=>x<2?+x:3).reduce((a,x,i) => a+(x<<2*i), 0);
		
		let state = new CubeState(p2, p1, p0, o);
		let normalize = state.normalize();
		let solution = search(state);
		res.json({normalize, solution});
	})
;

module.exports = router;
