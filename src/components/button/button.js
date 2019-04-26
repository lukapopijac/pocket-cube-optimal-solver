import './button.css';
import makeElement from '/html2element.js';

export default class {
	constructor({caption, onClick, primary}) {
		this.element = makeElement`
			<button type="button" class="button ${primary && 'button-primary'}">${caption}</button>
		`;
		
		this.element.addEventListener('click', onClick);
	}
};
