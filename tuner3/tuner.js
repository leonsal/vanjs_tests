const EL_DIGIT  = 'digit';
const EL_SEP    = 'sep';
const EL_SUFFIX = 'suffix';


export default class Tuner extends HTMLElement {

    static observedAttributes = ['frequency'];

    constructor() {

        super();
    }

    set ndigits(n) {

        // Can be set only once before inserting component into the page.
        if (this.#ndigits !== null) {
            return;
        }
        this.#ndigits = n;
    }

    set frequency(f) {

        this.#freq = f;
        if (!this.isConnected) {
            return;
        }
        this.#updateFreq();
    }

    set sep(v) {

        this.#sep = v;
    }

    set fontSize(fsize) {

        this.#fontSize = fsize;
    }

    set suffix(v) {

        this.#suffix = v;
    }

    set leftOpacity(v) {

        this.#leftOpacity = v;
    }

    get frequency() {

        return this.#freq;
    }

    // Called by browser when component is inserted in the page
    connectedCallback() {

        this.#shadow = this.attachShadow({ mode: "open" });

        // Get ndigits attribute from markup
        const ndigits = this.getAttribute("ndigits");
        if (ndigits !== null) {
            this.#ndigits = parseInt(ndigits);
        }
        this.#ndigits = this.#ndigits ?? 4;

        // Get frequency attribute from markup
        const freq = this.getAttribute("frequency");
        if (freq !== null) {
            this.#freq = parseInt(freq);
        }

        // Get separator attribute from markup
        const sep = this.getAttribute("sep");
        if (sep !== null) {
            this.#sep = sep;
        }

        // Get font-size attribute from markup
        const fontSize = this.getAttribute("font-size");
        if (fontSize !== null) {
            this.#fontSize = fontSize;
        }

        // Get left-opacity attribute from markup
        const leftOpacity = this.getAttribute("left-opacity");
        if (leftOpacity !== null) {
            this.#leftOpacity = parseFloat(leftOpacity);
        }

        // Get left-opacity attribute from markup
        const suffix = this.getAttribute("suffix");
        this.#suffix = suffix ?? this.#suffix;

        this.#build();
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

    // Builds the tuner internal DOM tree
    #build() {

        // Builds optional suffix
        if (this.#suffix) {
            this.#shadow.appendChild(this.#newSuffix(this.#suffix));
        }
        // Builds digits and separators
        let group = 0;
        for (let pos = 0; pos < this.#ndigits; pos++) {
            let digit = this.#newDigit(pos, 0);
            if (!this.#shadow.firstChild) {
                this.#shadow.appendChild(digit);
            } else {
                this.#shadow.insertBefore(digit, this.#shadow.firstChild);
            }
            group++;
            if (group && ((group % 3) == 0) && (pos < this.#ndigits-1) && this.#sep) {
                const s = this.#newSep(this.#sep);
                this.#shadow.insertBefore(s, this.#shadow.firstChild);
            }
        }
        this.#updateFreq();
    }

    // Updates frequency
    #updateFreq() {

        for (let pos = 0; pos < this.#ndigits; pos++) {
            const n = this.#digitValue(pos);
            const el = this.#digitElement(pos);
            let opacity = 1.0;
            const max = 10**(pos+1) - 1;
            if (pos != 0 && n == 0 && max > this.#freq) {
                opacity = this.#leftOpacity;
            }
            this.#setDigit(pos, n, opacity);
            // Sets the separator opacity
            if (el.nextSibling && el.nextSibling.dataset.type == EL_SEP) {
                el.nextSibling.style.opacity = opacity;
            }
        }
    }

    // Process digit keydown events
    #onDigitKeyDown(pos, ev) {

        if (ev.key >= '0' && ev.key <= '9') {
            this.#changeDigit(pos, parseInt(ev.key));
            this.#focusNext(pos);
            return;
        }
        if (ev.key == 'ArrowUp') {
            this.#incDigit(pos);
            return;
        }
        if (ev.key == 'ArrowDown') {
            this.#decDigit(pos);
            return;
        }
        if (ev.key == 'ArrowLeft') {
            this.#focusPrev(pos);
            return;
        }
        if (ev.key == 'ArrowRight') {
            this.#focusNext(pos);
            return;
        }
    }

    // Process digit wheel events
    #onDigitWheel(pos, ev) {

        if (ev.deltaY > 0) {
            this.#decDigit(pos);
        } else {
            this.#incDigit(pos);
        }
    }

    // Sets the focus to previous digit from 'pos', if possible
    #focusPrev(pos) {

        const digit = this.#digitElement(pos+1); 
        if (digit) {
            digit.focus();
        }
    }

    // Sets the focus to next digit from 'pos', if possible
    #focusNext(pos) {

        const digit = this.#digitElement(pos-1); 
        if (digit) {
            digit.focus();
        }
    }

    // Returns the digit DOM element at the specified position
    #digitElement(pos) {

        let count = 0;
        let curr = this.#shadow.lastChild;
        while (curr) {
            if (curr.dataset.type == EL_DIGIT) {
                if (count == pos) {
                    return curr;
                }
                count++;
            }
            curr = curr.previousSibling;
        }
    }

    // Sets the value and opacity of the digit text element at the specified 'pos'
    #setDigit(pos, val, opacity) {

        const digit = this.#digitElement(pos);
        digit.style.opacity = opacity;
        digit.firstChild.nodeValue = val.toString();
    }

    #changeDigit(pos, val) {

        const old = this.#digitValue(pos)
        if (old == val) {
            return;
        }
        const diff = (val - old) * 10**pos;
        this.frequency += diff;
    }

    #decDigit(pos) {

        const delta = 10**pos;
        if (this.#freq < delta) {
            return;
        }
        this.frequency -= delta;
    }

    #incDigit(pos) {

        this.frequency += 10 **pos;
    }

    // Returns the digit value from 0 to 9 from the frequency value 
    // and digit position from right to left
    #digitValue(pos) {

        let n = Math.floor(this.#freq / (10**pos));
        if (n > 9) {
            n = n % 10;
        }
        return n;
    }

    // Creates and returns HTML element for a digit at the specified position
    #newDigit(pos, val) {

        // Creates HTML label for the digit
        const el = document.createElement("label");
        const text = document.createTextNode(val.toString());
        el.appendChild(text);

        // Set attributes
        el.tabIndex = -1;
        el.dataset.type = EL_DIGIT;
        el.style.opacity = this.#leftOpacity;
        if (this.#fontSize) {
            el.style.fontSize = this.#fontSize;
        }

        // Set event handles
        el.onmousedown = (ev) => {
            console.log('mouse down');
            ev.target.focus();
            ev.preventDefault();
        },
        el.onkeydown = (ev) => this.#onDigitKeyDown(pos, ev);
        el.onwheel   = (ev) => this.#onDigitWheel(pos, ev);
        el.onmouseenter = () => el.style.backgroundColor = "lightgray";
        el.onmouseleave = () => el.style.backgroundColor = "white";
        return el;
    }

    // Creates and returns HTML element for thousands separator
    #newSep(val) {

        const el = document.createElement("label");
        el.dataset.type = EL_SEP;
        if (this.#fontSize) {
            el.style.fontSize = this.#fontSize;
        }
        const text = document.createTextNode(val);
        el.appendChild(text);
        return el;
    }

    // Creates and returns HTML element for suffix
    #newSuffix(val) {

        const el = document.createElement("label");
        el.dataset.type = EL_SUFFIX;
        if (this.#fontSize) {
            el.style.fontSize = this.#fontSize;
        }
        const text = document.createTextNode(val);
        el.appendChild(text);
        return el;
    }

    #shadow         = null;
    #ndigits        = null;
    #freq           = 0;;
    #sep            = null;
    #fontSize       = null;
    #leftOpacity    = 1.0;
    #suffix         = null;
}

customElements.define("my-tuner", Tuner);


