'use strict';

class PriorityQueue {
	constructor(maxPriority) {
		this.q = [];
		this.q.length = maxPriority+1;
		for(let i=0; i<this.q.length; i++) this.q[i] = [];
	}
	
	push(val, priority) {
		this.q[priority].push(val);
	}
	
	pop() {
		for(let i=0; i<this.q.length; i++) {
			if(this.q[i].length) return this.q[i].pop();
		}
		return null;
	}
	
	isEmpty() {
		for(let i=0; i<this.q.length; i++) {
			if(this.q[i].length) return false;
		}
		return true;
	}
}

module.exports = PriorityQueue;
