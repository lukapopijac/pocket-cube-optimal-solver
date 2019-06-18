let _easing = x => 3*x**2 - 2*x**3;

export function animate({duration, updateFn, onComplete}) {
	let _t0 = performance.now();
	let _requestId = requestAnimationFrame(step);
	let _resolve = null;
	return new Promise(resolve => { _resolve = resolve });	

	function step() {
		let t = performance.now() - _t0;

		if(t < duration) {
			updateFn(_easing(t / duration));
			_requestId = requestAnimationFrame(this._step);
		} else {
			updateFn(1);
			_requestId = requestAnimationFrame(_ => {
				this._onComplete();
				this._resolve();
			});
		}
	}
}





export default class Animate {
	constructor({duration, updateFn, onComplete, easing}) {
		this._t0 = null;
		this._updateFn = updateFn;
		this._duration = duration;

		this._step = this._step.bind(this);
		this._requestId = null;
		this._resolve = null;
        this._onComplete = onComplete || (_ => _);

        this._easing = easing || (x => 3*x**2 - 2*x**3);
	}

	_step() {
		let t = performance.now() - this._t0;

		if(t < this._duration) {
			this._updateFn(this._easing(t / this._duration));
			this._requestId = requestAnimationFrame(this._step);
		} else {
			this._updateFn(1);
			this._requestId = requestAnimationFrame(_ => {
				this._onComplete();
				this._resolve();
			});
		}		
	}

	// TODO: remove onComplete, make promise to be rejected or resolved
	// (maybe reject when somebody stealsResolve)

	run() {
		this._t0 = performance.now();
		this._requestId = requestAnimationFrame(this._step);
		return new Promise(resolve => { this._resolve = resolve; });
	}

    async stealResolve() {
        // result of this: If there was a chain of animations such that each 
		// animation starts after previous one gets resolved, one can break the chain
		// by calling this function, and in the chain observing the return value
		// of the promise (stopped = true), and stop executing the rest if return
		// value is true. The active animation will still complete.

		this._resolve(true);  // stopped = true
		return new Promise(resolve => { this._resolve = resolve; });
	}

    kill() {
        cancelAnimationFrame(this._requestId);
        this._requestId = null;
    }	
}
