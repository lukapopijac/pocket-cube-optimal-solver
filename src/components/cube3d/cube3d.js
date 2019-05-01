import t from './cube3d.html';

const template = document.createElement('template');
template.innerHTML = t;

export class Cube3d extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this._styleForResize = document.createElement('style');
		this.shadowRoot.appendChild(this._styleForResize);

		this._resize = this._resize.bind(this);
	}

	connectedCallback() {
		this._resize();
		window.addEventListener('resize', this._resize);
	}
	disconnectedCallback() {
		window.removeEventListener('resize', this._resize);
	}
	_resize() {
		let el = this.shadowRoot.querySelector('div');
		let w = el.offsetWidth;
		this.scale = w/540;
	}

	set scale(s) {
		// for some reason directly atlering style on some element inside shadow dom doesn't work
		this._styleForResize.innerHTML = `:host > div { transform: scale(${s}); }`;
	}
}

customElements.define('m-cube3d', Cube3d);
