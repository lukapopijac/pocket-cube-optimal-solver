import t from './cube-unfolded.html';
const template = document.createElement('template');
template.innerHTML = t;

export class CubeUnfolded extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._stickerValues = 'urfuflubrulbdfrdlfdrbdbl'.split('');

		// sort just to be sure that this is independent from order in html,
		// that's why every sticker has data-idx
		this._stickerElementsSorted = Array.from(this.shadowRoot.querySelectorAll('.sticker'))
			.sort((a, b) => a.dataset.idx - b.dataset.idx)
		;

		this._refresh();
		
		// set click handler to react on click on sticker
		this.shadowRoot.addEventListener('click', evt => {
			let idx = evt.target.dataset.idx;
			if(isNaN(idx)) return;  // not clicked on sticker
			this._stickerValues[idx] = this._getSelectedColor();
			this._refresh();
			this.dispatchEvent(new CustomEvent('click-sticker'));
		});
	}

	_refresh() {
		let stickerValues = this._stickerValues;
		for(let i=0; i<stickerValues.length; i++) {
			if(this._stickerElementsSorted[i].dataset.val != stickerValues[i]) {
				this._stickerElementsSorted[i].dataset.val = stickerValues[i];
			}
		}
	}

	set getSelectedColor(callback) {
		this._getSelectedColor = callback;
	}
	get stickerValues() {
		return this._stickerValues;
	}
	set stickerValues(vals) {
		this._stickerValues = vals;
		this._refresh();
	}
	setStickersToSolved() {
		this._stickerValues = 'urfuflubrulbdfrdlfdrbdbl'.split('');
		this._refresh();
	}
	setStickersToEmpty() {
		this._stickerValues = '........................'.split('');
		this._refresh();
	}
}

customElements.define('m-cube-unfolded', CubeUnfolded);
