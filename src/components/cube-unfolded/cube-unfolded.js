import t from './cube-unfolded.html';

const template = document.createElement('template');
template.innerHTML = t;

export class CubeUnfolded extends HTMLElement {
	constructor({getSelectedColor}) {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._stickerValues = 'urfuflubrulbdfrdlfdrbdbl'.split('');
		this._stickerElementsSorted = Array.from(this.shadowRoot.querySelectorAll('.sticker'))
			.sort((a, b) => a.dataset.idx - b.dataset.idx)
		;

		this._refresh();
		
		// set click handler on each sticker
		for(let el of this._stickerElementsSorted) {
			el.addEventListener('click', evt => {
				let idx = evt.target.dataset.idx;
				this._stickerValues[idx] = getSelectedColor();
				this._refresh();
				this.dispatchEvent(new CustomEvent('click-sticker'));
			});
		}
	}

	_refresh() {
		let stickerValues = this._stickerValues;
		for(let i=0; i<stickerValues.length; i++) {
			if(this._stickerElementsSorted[i].dataset.val != stickerValues[i]) {
				this._stickerElementsSorted[i].dataset.val = stickerValues[i];
			}
		}
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
