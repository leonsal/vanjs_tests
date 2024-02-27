import van from "./van-1.2.8.debug.js"

const {div, label, span,input, button} = van.tags;

// freqState: Van state with the frequency
// ndigits  : Total number of digits
// sep      : Optional string with thousands group separator
// fontSize : Optional font size style string
// suffix   : Optional suffix string
export default function Tuner ({freqState, ndigits, sep, fontSize, suffix}) {

    // Returns the digit value from 0 to 9 from the frequency and its position from left to right
    const digitValue = (freq, pos) => {

        let n = Math.floor(freqState.val / (10**pos));
        if (n > 9) {
            n = n % 10;
        }
        return n;
    }

    // Each digit is a Van component
    const Digit = (pos) => {

        // Digit has a derived state from freqState which contains the value of the single digit
        // If freqState changes, digitState must be recalculated
        const digitState = van.derive(() => {
            return digitValue(freqState.val, pos);
        });

        // Digit background color is a Van state changed by enter/leave
        const bgColor = van.state("white")

        const opacityState = van.derive(()=> {

            let n = digitValue(freqState.val, pos);
            const max = 10**(pos+1) - 1;
            let opacity;
            if (pos != 0 && n == 0 && max > freqState.val) {
                opacity = 0.1;
            } else {
                opacity = 1.0;
            }
            //console.log("pos:", pos, "n", n, "max", max, "freq", freqState.val, "opacity:", opacity);
            return opacity;
        });

        // Returns a derived style from two states: opacityState, bgColor
        const digitStyle = () => {
            let style = `opacity: ${opacityState.val}; background-color: ${bgColor.val};`
            if (fontSize) {
                style += `font-size: ${fontSize};`
            }
            return style;
        }

        // Each digit is rendered as an HTML label. A <span> could also have been used.
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

    // Returns the derived style of the separator
    const sepStyle = () => {

        let style = `opacity: ${opacityState.val};`
        if (fontSize) {
            style += `font-size: ${fontSize};`
        }
        return style;
    }

    const Separator = (pos) => {
        return span({style: sepStyle}, sep);
    }


    // Increments the current digit by one
    const incDigit = (pos, val) => {

        freqState.val += 10**(pos)
    }

    // Decrements the current digit by on
    const decDigit = (pos, val) => {

        if (val == 0) {
            return;
        }
        freqState.val -= 10**(pos)
    }

    // Sets the focus to previous digit, if possible
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

    // Sets the focus to next digit, if possible
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

    // Sets the numeric value of the digit and then
    // advances to next digit, if possible.
    const setDigit = (pos, v, el, newv) => {

        if (v !== newv) {
            const diff = (newv - v) * 10**pos;
            freqState.val += diff;
        }
        nextDigit(el);
    }

    // Builds list of Tuner children elements
    const digits = [];
    if (suffix !== undefined) {
        digits.push(span({style: sepStyle}, suffix));
    }
    let group = 0;
    for (let i = 0; i < ndigits; i++) {
        digits.unshift(Digit(i));
        group++;
        if (group && ((group % 3) == 0) && (i < ndigits-1) && sep) {
            digits.unshift(Separator(i));
        }
    }

    return div(digits);
}



