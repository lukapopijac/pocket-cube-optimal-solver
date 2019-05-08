import t from './solution-controls.html';
const template = document.createElement('template');
template.innerHTML = t;

class SolutionControls extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('m-solution-controls', SolutionControls);
