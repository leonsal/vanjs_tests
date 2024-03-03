//
// ListItem component
//
export class ListItem extends HTMLElement {

    static observedAttributes = ['selected'];

    constructor() {

        super();
        this.setAttribute("selected", false);
    }

    set text(val) {

        this.#text = val;
    }

    // Set list item selected property
    set selected(val) {

        // Get parent list component and multi-select attribute value
        const list = this.parentNode.host;
        const multiSel = list.dataset.multiSelect;
        const sel = val ? true : false;

        // If not multi select, unselect other list items
        if (sel && multiSel === 'false') {
            list.unselectOthers(this);
        }

        this.#selected = sel;
        this.setAttribute("selected", sel);
    }

    // Get list item selected property
    get selected() {

        return this.#selected;
    }

    // Internal function used in unselectOthers() to unselect list item
    unselect() {

        this.#selected = false;
        this.setAttribute("selected", false);
    }

    connectedCallback() {

        this.attachShadow({ mode: "open" });

        // Creates item container element
        const cont = document.createElement("div");
        const text = document.createTextNode(this.#text);
        cont.appendChild(text);
        this.shadowRoot.append(cont);

        // Sets event handlers on the item container
        cont.onmouseover = () => {
            this.#mouseover = true;
            this.#updateStyle(cont);
        }
        cont.onmouseout = () => {
            this.#mouseover = false;
            this.#updateStyle(cont);
        }
        cont.onclick = () => {
            this.selected = true;
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
        if (name == "selected" && (oldValue != newValue)) {
            if (this.isConnected) {
                this.#updateStyle(this.shadowRoot.firstChild);
            }
        }
    }

    // Updates the style of the list item
    #updateStyle(el) {

        if (this.#mouseover) {
            if (this.#selected) {
                el.style.backgroundColor = "gray";
            } else {
                el.style.backgroundColor = "lightgray";
            }
        } else {
            if (this.#selected) {
                el.style.backgroundColor = "lightgray";
            } else {
                el.style.backgroundColor = "white";
            }
        }
    }


    #text = '';
    #mouseover = false;
    #selected = false;
}

customElements.define("my-list-item", ListItem);

//
// List of ListItem component
//
export class List extends HTMLElement {

    constructor() {

        super();
        this.dataset.multiSelect = false
    }

    set multiSelect(val) {

        const msel = val ? true : false;
        this.dataset.multiSelect = msel;
    }

    get multiSelect() {

        return this.dataset.multiSelect;
    }

    // Selected property returns array of selected items
    get selected() {

        const sel = [];
        let child = this.shadowRoot.firstChild;
        while (child) {
            if (child.selected) {
                sel.push(child);
            }
            child = child.nextSibling;
        }
        return sel;
    }

    set unselectAll(_) {

        let child = this.shadowRoot.firstChild;
        while (child) {
            //console.log("unselect", child); 
            child.selected = false;
            child = child.nextSibling;
        }
    }

    unselectOthers(c) {

        console.log("unselectOthers");
        let child = this.shadowRoot.firstChild;
        while (child) {
            //console.log("unselect", child); 
            if (child !== c) {
                child.unselect();
            }
            child = child.nextSibling;
        }
    }

    connectedCallback() {

        console.log("list connected");
        this.attachShadow({ mode: "open" });
    }

}

customElements.define("my-list", List);

