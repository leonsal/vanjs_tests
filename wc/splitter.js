
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

        // Center pane
        const center  = document.createElement("div");
        center.style.width = '10px';
        center.style.color = 'gray';

        // Right pane
        const right = document.createElement("div");

        cont.append(left, center, right);
        this.shadowRoot.append(cont);

        // Sets event handlers on the center splitter
        center.onmouseover = () => {
            this.#mouseover = true;
            this.#updateStyle(cont);
        }
        center.onmouseout = () => {
            this.#mouseover = false;
            this.#updateStyle(cont);
        }
        center.onclick = () => {
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

    #left = '';
    #right = '';
    #mouseover = false;
    #clicked = false;
}

customElements.define("my-hsplitter", HSplitter);

