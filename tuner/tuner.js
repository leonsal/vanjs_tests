import van from "./van-1.2.8.debug.js"

const {div, label, span} = van.tags;

// freqState  : Van state with the Tuner frequency
// ndigits    : Total number of digits
// sep        : Optional string with thousands group separator
// fontSize   : Optional font size style string
// suffix     : Optional suffix string
// leftOpacity: Optional opacity from [0,1] for the leftmost zeroes and separators
export default function Tuner ({freqState, ndigits, sep, fontSize, suffix, leftOpacity}) {

    leftOpacity = leftOpacity ?? 1.0;

    // Returns the digit value from 0 to 9 from the frequency value 
    // and digit position from right to left
    const digitValue = (freq, pos) => {

        let n = Math.floor(freq / (10**pos));
        if (n > 9) {
            n = n % 10;
        }
        return n;
    }

    // Returns the opacity value from 0.0 to 1.0 from the frequency value
    // and digit/separator position from right to left.
    const opacityValue = (freq, pos) => {

        let n = digitValue(freq, pos);
        const max = 10**(pos+1) - 1;
        let opacity;
        if (pos != 0 && n == 0 && max > freq) {
            opacity = leftOpacity;
        } else {
            opacity = 1.0;
        }
        return opacity;
    }

    // Each digit is a Van component with a position from 0 to N-1 starting from right to left.
    // Digit at position 0 is the least significant.
    const Digit = (pos) => {

        // Returns derivedState from freqState which contains the value [0,9] of the single digit.
        // If freqState changes, digitState must be recalculated.
        const digitState = van.derive(() => {

            return digitValue(freqState.val, pos);
        });

        // Returns opacityState from freqState which contains the opacity value [0.0,1.0]
        // of the digit to allow fading all the leftmost zeros.
        // If freqState changes, opacityState must be recalculated.
        const opacityState = van.derive(()=> {

            return opacityValue(freqState.val, pos);
        });

        // Digit background color is a Van state changed by enter/leave
        const bgColor = van.state("white")

        // Returns a derived style from two states: opacityState, bgColor
        const digitStyle = () => {

            let style = `opacity: ${opacityState.val}; background-color: ${bgColor.val};`
            if (fontSize) {
                style += `font-size: ${fontSize};`
            }
            return style;
        }

        // Increments the digit at position 'pos' by one
        const incDigit = (pos, val) => {

            freqState.val += 10**(pos)
        }

        // Decrements the digit at position 'pos' by one
        const decDigit = (pos, val) => {

            const delta = 10**pos;
            if (freqState.val < delta) {
                return;
            }
            freqState.val -= delta;
        }

        // Sets the focus to previous digit from 'el', if possible
        const prevDigit = (el) => {

            while (true) {
                el = el.previousSibling;
                if (!el) {
                    return;
                }
                if (el.tagName === 'LABEL') {
                    el.focus();
                    return;
                }
            }
        }

        // Sets the focus to next digit from 'el', if possible
        const nextDigit = (el) => {

            while (true) {
                el = el.nextSibling;
                if (!el) {
                    return;
                }
                if (el.tagName === 'LABEL') {
                    el.focus();
                    return;
                }
            }
        }

        // Sets the numeric value of the digit at position 'pos'
        // and then advances to next digit, if possible.
        const setDigit = (pos, v, el, newv) => {

            if (v !== newv) {
                const diff = (newv - v) * 10**pos;
                freqState.val += diff;
            }
            nextDigit(el);
        }

        // Each digit is rendered as an HTML label.
        // To allow focusing the digit to receive keyboard events,
        // the tabIndex attribute must be defined.
        return label({
                style: digitStyle,
                tabIndex: -1,
                onwheel: (ev) => ev.deltaY > 0 ? decDigit(pos, digitState.val) : incDigit(pos, digitState.val),
                onmouseenter: () => { bgColor.val = "lightgray";},
                onmouseleave: () => { bgColor.val = "white";},
                onmousedown: (ev) => {ev.target.focus(); ev.preventDefault()},
                onkeydown:(ev) => {
                    const val = digitState.val;
                    const el = ev.target;
                    if (ev.key >= 0 && ev.key <= 9) {
                        setDigit(pos, val, el, parseInt(ev.key));
                        return;
                    }
                    if (ev.key == 'ArrowUp') {
                        incDigit(pos, val);
                        return;
                    }
                    if (ev.key == 'ArrowDown') {
                        decDigit(pos, val);
                        return;
                    }
                    if (ev.key == 'ArrowLeft') {
                        prevDigit(el);
                        return;
                    }
                    if (ev.key == 'ArrowRight') {
                        nextDigit(el);
                        return;
                    }
                },
            },
            digitState
        );
    }

    // Separator is a Van component created from HTML <span> element.
    const Separator = (pos) => {

        // Returns opacityState from freqState which contains the opacity of the separator,
        // to allow fading all the left most zeros and separators.
        // If freqState changes, opacityState must be recalculated.
        const opacityState = van.derive(()=> {

            return opacityValue(freqState.val, pos);
        });

        // Returns the derived style of the separator which depends on opacityState
        const sepStyle = () => {

            let style = `opacity: ${opacityState.val};`
            if (fontSize) {
                style += `font-size: ${fontSize};`
            }
            return style;
        }

        return span({style: sepStyle}, sep);
    }


    // Builds list of Tuner children elements
    const digits = [];

    // Inserts  optional suffix
    if (suffix !== undefined) {
        let style = '';
        if (fontSize) {
            style += `font-size: ${fontSize};`
        }
        digits.push(span({style: style}, suffix));
    }

    // Inserts the digits and optional separators
    let group = 0;
    for (let i = 0; i < ndigits; i++) {
        digits.unshift(Digit(i));
        group++;
        if (group && ((group % 3) == 0) && (i < ndigits-1) && sep) {
            digits.unshift(Separator(i+1));
        }
    }

    return div(digits);
}



