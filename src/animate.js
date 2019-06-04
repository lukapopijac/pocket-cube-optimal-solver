export default class Animate {
	constructor({duration, updateFn, startVal = 0, endVal = 1, onComplete, easing}) {
		this._t0 = null;
		this._y = null;
		this._y0 = startVal;
		this._y1 = endVal;
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
			this._y = this._y0 + (this._y1 - this._y0) * this._easing(t / this._duration);
			this._requestId = requestAnimationFrame(this._step);
		} else {
			this._y = this._y1;
			this._requestId = requestAnimationFrame(_ => {
				this._onComplete();
				this._resolve();
			});
		}		
		
		this._updateFn(this._y);
	}

    async stealResolve() {
        // result of this: if there was defined chain of animations such that each 
        // animation starts after previous one gets resolved, this will break the chain.
        // only the current active animation will be completed.
		return new Promise(resolve => { this._resolve = resolve; });
	}

    kill() {
        cancelAnimationFrame(this._requestId);
        this._requestId = null;
    }
	
	run() {
		this._t0 = performance.now();
		this._requestId = requestAnimationFrame(this._step);
		return new Promise(resolve => { this._resolve = resolve; });
	}
}