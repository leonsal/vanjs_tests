import van from "./van-1.2.8.debug.js"

const {div, label} = van.tags;

export default function Tuner ({ndigits, freq}) {

    console.log(`freq:${freq.val}`);

    const Digit = (pos) => {
        // Calculates value of digit by its position
        console.log("DIGIT", pos);
        const power = 10**(pos+1);
        let n = freq.val % power;
        if (n > 10) {
            n = Math.floor(n/(10**(pos)));
        }
        const bgColor = van.state("white")
        return label({
                style:   () => `font-size: 64px; background-color: ${bgColor.val};`,
                onwheel: (ev) => ev.deltaY > 0 ? incDigit(pos): decDigit(pos),
                onmouseenter: () => { bgColor.val = "gray";},
                onmouseleave: () => { bgColor.val = "white";},
            },
            n.toString()
        );
    }

    const setDigit = (pos, v) => {

    }
    const incDigit = (pos) => {
        freq.val++;
        console.log("incDigit", pos, freq.val);
    }
    const decDigit = (pos) => {
        console.log("decDigit", pos);
    }
    const prevDigit = (pos) => {
        console.log("prevDigit", pos);
    }
    const nextDigit = (pos) => {
        console.log("nextDigit", pos);
    }

    const digits = [];
    for (let i = 0; i < ndigits; i++) {
        digits.push(Digit(ndigits-i-1));
    }

    return div(digits);
}



