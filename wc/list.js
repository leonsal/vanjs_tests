//
// ListItem component
//
export class ListItem extends HTMLElement {

    static observedAttributes = ['selected'];

    constructor() {

        super();
        this.setAttribute("selected", false);
    }

    // Sets item value property.
    // The value can be a string or an HTML inline node
    set value(val) {

        this.#value = val;
    }

    // Set list item selected property
    set selected(val) {

        // Get parent list component and multi-select attribute value
        const list = this.parentNode.host;
        const multiSel = list.dataset.multiSelect;
        const sel = val ? true : false;

        // If not multi select, unselect other list items
        if (sel && multiSel === 'false') {
            this.#unselectOthers(this);
        }

        this.#selected = sel;
        this.setAttribute("selected", sel);
    }

    // Get list item selected property
    get selected() {

        return this.#selected;
    }

    connectedCallback() {

        this.attachShadow({ mode: "open" });

        // Creates item container element and append value node
        const cont = document.createElement("div");
        let node = this.#value;
        if (typeof(this.#value) === 'string') {
            node = document.createTextNode(this.#value);
        }
        cont.appendChild(node);
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
            if (!this.selected) {
                this.selected = true;
            }
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

        //console.log(`Attribute ${name} has changed: ${oldValue} -> ${newValue}`);
        if (name == "selected" && (oldValue != newValue)) {
            if (this.isConnected) {
                this.#updateStyle(this.shadowRoot.firstChild);
                const list = this.parentNode.host;
                list.dispatchEvent(new CustomEvent('change'));
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

    // Unselect all list items except the item specifid
    #unselectOthers(c) {

        const list = this.parentNode.host;
        let child = list.shadowRoot.firstChild;
        while (child) {
            if (child !== c) {
                child.#selected = false;
                child.setAttribute("selected", false);
            }
            child = child.nextSibling;
        }
    }

    #value = '';
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

    // Removes all list elements
    clear() {

        let child = this.shadowRoot.firstChild;
        while (child) {
            this.shadowRoot.removeChild(child);
            child = this.shadowRoot.firstChild;
        }
    }

    // Overrides node append child, to append specified element in the component shadow dom
    appendChild(item) {

        return this.shadowRoot.appendChild(item);
    }

    // Overrides node remove child, to remove specified element from the component shadow dom
    removeChild(item) {

        return this.shadowRoot.removeChild(item);
    }

    connectedCallback() {

        this.attachShadow({ mode: "open" });
    }
}

customElements.define("my-list", List);

