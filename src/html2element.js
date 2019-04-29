// taken from https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function html2element(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


export default function makeElement(strings, ...parts) {
	let map = {};
	let htmlArray = [strings[0]];
	for(let i=0; i<parts.length; i++) {
		let part = parts[i];
		let element = null;
		if(part instanceof Element) element = part;
		else if(part && part.element instanceof Element) element = part.element;
		if(element) {
			let slotId = 'slot-' + Math.trunc(Math.random()*1e15);
			map[slotId] = element;
			htmlArray.push(`<slot id="${slotId}"></slot>`)	
		} else {
			htmlArray.push(parts[i]);
		}
		htmlArray.push(strings[i+1]);
	}

	let el = html2element(htmlArray.join(''));

	for(let id in map) {
		let slot = el.querySelector('#' + id);
		slot.parentNode.replaceChild(map[id], slot);
	}

	return el;
}
