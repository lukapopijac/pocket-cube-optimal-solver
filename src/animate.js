// if updateFn returns true, animation will be completed immediately

export default function animate(duration, updateFn, easing = x => 3*x**2 - 2*x**3) {
	let t0 = performance.now();
	let resolve;
	requestAnimationFrame(_step);
	return new Promise(r => { resolve = r });

	function _step() {
		let t = performance.now() - t0;

		if(t < duration) {
			let forceComplete = updateFn(easing(t / duration));
			if(forceComplete) resolve();
			else requestAnimationFrame(_step);
		} else {
			let forceComplete = updateFn(1);
			if(forceComplete) resolve();
			else requestAnimationFrame(resolve);
		}
	}
}
