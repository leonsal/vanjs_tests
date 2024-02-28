const EL_DIGIT  = 'digit';
const EL_SEP    = 'sep';
const EL_SUFFIX = 'suffix';

export default class Tuner extends EventTarget {

    // ndigits:   : Total number of digits
    // frequency  : Optional initial frequency
    // sep        : Optional string with thousands group separator
    // fontSize   : Optional font size style string
    // suffix     : Optional suffix string
    // leftOpacity: Optional opacity from [0,1] for the leftmost zeroes and separators
    constructor({ndigits, frequency, sep, fontSize, suffix, leftOpacity}) {

        // Call EventTarget contructor
        super();

        // Save config options
        this.#ndigits = ndigits;
        this.#fontSize = fontSize;
        frequency = frequency ?? 0;
        this.#leftOpacity = leftOpacity ?? 1.0;

        // Builds optional suffix
        this.#el = document.createElement("div");
        if (suffix) {
            this.#el.appendChild(this.#newSuffix(suffix));
        }
        // Builds digits and separators
        let group = 0;
        for (let pos = 0; pos < ndigits; pos++) {
            let digit = this.#newDigit(pos, 0);
            if (!this.#el.firstChild) {
                this.#el.appendChild(digit);
            } else {
                this.#el.insertBefore(digit, this.#el.firstChild);
            }
            group++;
            if (group && ((group % 3) == 0) && (pos < ndigits-1) && sep) {
                const s = this.#newSep(sep);
                this.#el.insertBefore(s, this.#el.firstChild);
            }
        }
        this.frequency = frequency;
    }

    // Returns the HTML element for this Tuner
    get el() {

        return this.#el;
    }

    // Get current frequency value
    get frequency() {

        return this.#freq;
    }

    // Sets new frequency value.
    // May dispatch event for registered listeners.
    set frequency(val) {

        this.#freq = val;

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

        // Dispatch custom event with new frequency
        this.dispatchEvent(new CustomEvent('frequency', {
            detail: { frequency: this.#freq }
        }));
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
        let curr = this.#el.lastChild;
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
        el.style.border = 'none';
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
    
    // Private instance properties
    #ndigits        = null;
    #fontSize       = null;
    #leftOpacity    = null;
    #el             = null;
    #freq           = 0;
}

