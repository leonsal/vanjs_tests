

function Digit(tuner, pos, val) {

    // Creates HTML label for the digit
    const el = document.createElement("label");
    const text = document.createTextNode(val.toString());
    el.appendChild(text);

    el.tabIndex = -1;
    el.style.fontSize = '72px';
    el.onmousedown = (ev) => {ev.target.focus(); ev.preventDefault()},
    el.onkeydown = (ev) => tuner.onDigitKeyDown(pos, ev);
    el.onwheel   = (ev) => tuner.onDigitWheel(pos, ev);

    return el;
}

function Separator(val) {

    const el = document.createElement("span");
    const text = document.createTextNode(val);
    el.appendChild(text);
    return el;
}


export default class Tuner extends EventTarget {

    // ndigits:   : Total number of digits
    // sep        : Optional string with thousands group separator
    // fontSize   : Optional font size style string
    // suffix     : Optional suffix string
    // leftOpacity: Optional opacity from [0,1] for the leftmost zeroes and separators
    constructor({ndigits, sep, fontSize, suffix, leftOpacitiy}) {

        super();
        this.#ndigits = ndigits;
        this.#el = document.createElement("div");
        let group = 0;
        for (let pos = 0; pos < ndigits; pos++) {
            let digit = Digit(this, pos, 2);
            if (!this.#el.firstChild) {
                this.#el.appendChild(digit);
            } else {
                this.#el.insertBefore(digit, this.#el.firstChild);
            }
            group++;
            if (group && ((group % 3) == 0) && (pos < ndigits-1) && sep) {
                const s = Separator(sep);
                this.#el.insertBefore(s, this.#el.firstChild);
            }
        }
    }

    get el() {

        return this.#el;
    }

    get frequency() {

        return this.#freq;
    }

    set frequency(val) {

        this.#freq = val;

        // Returns the digit value from 0 to 9 from the frequency value 
        // and digit position from right to left
        const digitValue = (freq, pos) => {

            let n = Math.floor(freq / (10**pos));
            if (n > 9) {
                n = n % 10;
            }
            return n;
        }
        for (let pos = 0; pos < this.#ndigits; pos++) {
            this.#setDigit(pos, digitValue(this.#freq, pos));
        }
    }

    onDigitKeyDown(pos, ev) {

        if (ev.key >= 0 && ev.key <= 9) {
            this.#setDigit(pos, parseInt(ev.key));
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

    onDigitWheel(pos, ev) {

        if (ev.deltaY > 0) {
            this.#decDigit(pos);
        } else {
            this.#incDigit(pos);
        }
    }

    // Sets the focus to previous digit from 'pos', if possible
    #focusPrev(pos) {

        const digit = this.#digitAt(pos+1); 
        if (digit) {
            digit.focus();
        }
    }

    // Sets the focus to next digit from 'pos', if possible
    #focusNext(pos) {

        const digit = this.#digitAt(pos-1); 
        if (digit) {
            digit.focus();
        }
    }

    // Returns the digit DOM element at the specified position
    #digitAt(pos) {

        let count = 0;
        let curr = this.#el.lastChild;
        while (curr) {
            if (curr.tagName == 'LABEL') {
                if (count == pos) {
                    return curr;
                }
                count++;
            }
            curr = curr.previousSibling;
        }
    }

    // Sets the value of the digit at the specified 'pos'
    #setDigit(pos, val) {

        const digit = this.#digitAt(pos);
        digit.firstChild.nodeValue = val.toString();
    }

    #decDigit(pos) {

        this.frequency -= 10 **pos;
    }

    #incDigit(pos) {

        this.frequency += 10 **pos;
    }

    
    // Private instance properties
    #ndigits    = null;
    #el         = null;     // Main DOM element
    #freq       = 0;
}

