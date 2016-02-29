"use strict";

//function PriorityQueue(maxPriority) {
//	if(maxPriority == null) maxPriority = 0;
//	var q = [];
//	for(var i=0; i<=maxPriority; i++) q.push([]);
//	
//	return {
//		push: function(val, priority) {
//			q[priority].push(val);
//		},
//		pop: function() {
//			for(var i=0; i<maxPriority; i++) {
//				if(q[i].length) return q[i].pop();
//			}
//			return null;
//		}
//	}
//}

class PriorityQueue {
	constructor(maxPriority) {
		this.maxPriority = maxPriority || 0;
		this.q = [];
		for(let i=0; i<=maxPriority; i++) this.q.push([]);
	}
	
	push(val, priority) {
		this.q[priority].push(val);
	}
	
	pop() {
		for(let i=0; i<this.maxPriority; i++) {
			if(this.q[i].length) return this.q[i].pop();
		}
		return null;
	}
}

module.exports = PriorityQueue;
