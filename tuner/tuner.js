import van from "./van-1.2.8.debug.js"

const {div, label, span,input, button} = van.tags;

// freqState: Van state with the frequency
// ndigits  : number of digits
export default function Tuner ({freqState, ndigits, sep}) {

    // Each digit is a Van component
    const Digit = (pos) => {

        // Digit has a derived state from freqState which contains the value of the single digit
        // If freqState changes, digitState must be recalculated
        const digitState = van.derive(() => {
            let n = Math.floor(freqState.val / (10**pos));
            if (n > 9) {
                n = n % 10;
            }
            return n;
        });

        // Digit background color is a Van state changed by enter/leave
        const bgColor = van.state("white")
        const derivedStyle = () => {
            return  `font-size: 64px; background-color: ${bgColor.val};`
        }

        // Each digit is rendered as an HTML label. A <span> could also have been used.
        // To allow focusing the digit to receive keyboard events,
        // the tabIndex attribute must be defined.
        return label({
                style: derivedStyle,
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

    const incDigit = (pos, val) => {
        freqState.val += 10**(pos)
    }

    const decDigit = (pos, val) => {
        if (val == 0) {
            return;
        }
        freqState.val -= 10**(pos)
    }

    const prevDigit = (el) => {

        while (true) {
            el = el.previousSibling;
            if (!el) {
                return;
            }
            if (el.nodeType !== Node.TEXT_NODE) {
                el.focus();
                return;
            }
        }
    }

    const nextDigit = (el) => {

        while (true) {
            el = el.nextSibling;
            if (!el) {
                return;
            }
            if (el.nodeType !== Node.TEXT_NODE) {
                el.focus();
                return;
            }
        }
    }

    const setDigit = (pos, v, el, newv) => {
        //console.log("setDigit", pos, v, newv);
        if (v == newv) {
            return;
        }
        const diff = (newv - v) * 10**pos;
        freqState.val += diff;
        nextDigit(el);
    }

    const digits = [];
    let group = 0;
    for (let i = 0; i < ndigits; i++) {
        digits.unshift(Digit(i));
        group++;
        if (group && ((group % 3) == 0) && (i < ndigits-1) && sep) {
            digits.unshift(sep);
        }
    }

    return div(digits);
}



