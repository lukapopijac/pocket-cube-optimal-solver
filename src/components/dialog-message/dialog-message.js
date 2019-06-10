const template = document.createElement('template');
template.innerHTML = require('./dialog-message.html');


export class DialogMessage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.shadowRoot.host.addEventListener('click', evt => {
			this.hidden = true;
		});
	}
}

customElements.define('m-dialog-message', DialogMessage);
