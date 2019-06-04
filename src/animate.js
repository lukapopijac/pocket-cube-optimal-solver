export default class Animate {
	constructor({duration, updateFn, startVal = 0, endVal = 1, v0 = 0, onComplete, easing}) {
		this._t_elapsed = 0;
		this._t0 = null;
		this._y = null;
		this._y0 = startVal;
		this._y1 = endVal;
		this._v0 = v0;
		this._updateFn = updateFn;
		this._duration = duration;
		
		this._step = this._step.bind(this);
		this._requestId = null;
		this._resolve = null;
        this._onComplete = onComplete || (_ => _);
        
        this._easing = easing || (x => {
            let v = this._v0;
            return (v-2)*x**3 + (3-2*v)*x**2 + v*x;    
        });
	}
	
	_getCurrentDerivative() {
		let x = (performance.now() - this._t0) / this._duration;
		let v = this._v0;
		return 3*(v-2)*x*x + 2*(3-2*v)*x + v;
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

	/** Restart animation starting from current point with new duration. Preserve current speed.
	 *  This is used for slowing down or speeding up current animation.
	 */
	async finishIn(duration) {
		if(duration > 0) {
			let scaleFactor = (this._y1 - this._y0) / (this._y1 - this._y) * duration / this._duration;
			this._v0 = this._getCurrentDerivative() * scaleFactor;
			this._y0 = this._y;
			this._duration = duration;
			this._t_elapsed = 0;
			this._t0 = performance.now();
		}
		return new Promise(resolve => { this._resolve = resolve; });
	}

	// stop(shouldComplete, shouldResolve) {
	// 	this._t_elapsed = performance.now() - this._t0;
	// 	cancelAnimationFrame(this._requestId);
	// 	this._requestId = null;
	// 	if(shouldComplete) this._onComplete();
	// 	if(shouldResolve) this._resolve();
	// }
	
	run() {
		this._t0 = performance.now() - this._t_elapsed;
		this._requestId = requestAnimationFrame(this._step);
		return new Promise(resolve => { this._resolve = resolve; });
	}
}
