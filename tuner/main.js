import van from "./van-1.2.8.debug.js"
import Tuner  from "./tuner.js"

const {button, div, p, select, span, hr} = van.tags;

const title = div(p("Tuner Tests"), hr());;
van.add(document.body, title);

const freq1 = van.state(123);
const test = div(
    button({
        onclick: () => {freq1.val++; console.log("Inc:", freq1.val)},
    }, "Inc"),
    button({
        onclick: () => {freq1.val--; console.log("Dec:", freq1.val)},
    }, "Dec"),
    span(freq1),
);
van.add(document.body, test);

const tuner1 = Tuner({
    freqState: freq1,
    ndigits: 6,
    sep: '.',
});
van.add(document.body, tuner1);

const freq2 = van.state(230445);
const tuner2 = Tuner({
    freqState: freq2,
    ndigits: 8,
    sep: '|',
});
van.add(document.body, tuner2);

