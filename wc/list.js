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

    // Set list item selected property (true|false)
    set selected(val) {

        // Get parent list component and multi-select attribute value
        const div = this.parentNode;
        const multiSel = div.parentNode.host.dataset.multiSelect;
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

    // Called by browser when component is inserted in the page
    connectedCallback() {

        this.attachShadow({ mode: "open" });


        // Creates item container element and append
        // node value specified by user in 'value' property.
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
                const list = this.parentNode;
                list.dispatchEvent(new CustomEvent('change'));
            }
        }
    }

    // Updates the style of the list item
    #updateStyle(el) {

        let color = "white"
        if (this.#mouseover) {
            if (this.#selected) {
                color = "gray";
            } else {
                color = "lightgray";
            }
        } else {
            if (this.#selected) {
                color = "lightgray";
            }
        }
        el.style.backgroundColor = color;
    }

    // Unselect all list items except the item specified
    #unselectOthers(c) {

        const list = this.parentNode;
        let child = list.firstChild;
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
        let cont = this.shadowRoot.firstChild;
        let child = cont.firstChild;
        while (child) {
            if (child.selected) {
                sel.push(child);
            }
            child = child.nextSibling;
        }
        return sel;
    }

    // Unselect all list items
    unselect() {

        const cont = this.shadowRoot.firstChild;
        let child = cont.firstChild;
        while (child) {
            child.selected = false;
            child = child.nextSibling;
        }
    }

    // Removes all list elements
    clear() {

        const cont = this.shadowRoot.firstChild;
        let child = cont.firstChild;
        while (child) {
            cont.removeChild(child);
            child = cont.firstChild;
        }
    }

    // Overrides node append child, to append specified element in the component shadow dom
    appendItem(item) {

        return this.shadowRoot.firstChild.append(item);
    }

    // Overrides node remove child, to remove specified element from the component shadow dom
    removeItem(item) {

        return this.shadowRoot.firstChild.removeChild(item);
    }

    // Called by browser when component is inserted in the page
    connectedCallback() {

        this.attachShadow({mode: "open" });
        const container = document.createElement("div");
        container.style.borderStyle = 'solid';
        container.style.borderWidth = '1px';
        container.style.overflow = 'auto';
        container.style.height = '200px';
        this.shadowRoot.append(container);
    }
}

customElements.define("my-list", List);

