
export class HSplitter extends HTMLElement {

    static observedAttributes = ['selected'];

    constructor() {

        super();
        this.setAttribute("selected", false);
    }

    // Sets left pane content
    set left(val) {

        this.#left = val;
    }

    // Sets right pane content
    set right(val) {

        this.#right = val;
    }

    // Called by browser when component is inserted in the page
    connectedCallback() {

        this.attachShadow({ mode: "open" });

        // Container
        const cont = document.createElement("div");
        cont.style.display = 'flex';
        cont.style.flexDirection = 'row';

        // Left pane
        const left = document.createElement("div");
        left.style.flexGrow = this.#split;
        if (typeof(this.#left) === 'string') {
            left.append(document.createTextNode(this.#left));
        } else {
            left.append(this.#left);
        }

        // Center handle
        const center  = document.createElement("div");
        center.style.width = '8px';
        center.style.backgroundColor = 'gray';

        // Right pane
        const right = document.createElement("div");
        right.style.flexGrow = 100-this.#split;
        right.setAttribute("draggable", "off");
        if (typeof(this.#right) === 'string') {
            right.append(document.createTextNode(this.#right));
        } else {
            right.append(this.#right);
        }

        cont.append(left, center, right);
        this.shadowRoot.append(cont);

        // Sets event handlers on the center handle
        center.onmouseover = () => {
            this.#mouseover = true;
            this.#updateStyle(center);
        }
        center.onmouseout = () => {
            this.#mouseover = false;
            this.#updateStyle(center);
        }
        center.onmousedown = () => {
            this.#mousedown = true;
        }
        center.onmouseup = () => {
            this.#mousedown = false;
        }
        center.onmousemove = (ev) => {
            if (!this.#mousedown) {
                return;
            }
            this.#drag(ev);
        }
    }

    // Called by browser when component is removed from the page
    disconnectedCallback() {
    }

    // Called by browser when component is moved to new page
    adoptedCallback() {
    }

    // Called by browser when observable attribute has changed
    attributeChangedCallback(name, oldValue, newValue) {

        console.log(`Attribute ${name} has changed: ${oldValue} -> ${newValue}`);
    }

    #drag(ev) {
        console.log("drag", this.#mousedown);
    }

    #updateStyle(el) {

        if (this.#mouseover) {
            el.style.cursor = 'col-resize';
        }


    }

    #left = '';
    #right = '';
    #mouseover = false;
    #split = 20;
    #mousedown = false;
    #clicked = false;
}

customElements.define("my-hsplitter", HSplitter);

