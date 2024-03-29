import van from "./van-1.2.8.debug.js"
import Tuner  from "./tuner.js"

const {button, div, h1, span, hr} = van.tags;

const freq1 = van.state(123);
const test = div(
    h1("Tuner component tests"),
    hr(),
    button({ onclick: () => {freq1.val++}, }, "Inc"),
    button({ onclick: () => {freq1.val--}, }, "Dec"),
    span(" frequency: "), span(freq1),
);
van.add(document.body, test);


const tuner1 = Tuner({
    freqState:  freq1,
    ndigits:    4,
    fontSize:   '64px',
});
van.add(document.body, tuner1);


const freq2 = van.state(230445);
const tuner2 = Tuner({
    freqState:  freq2,
    ndigits:    8,
    fontSize:   '72px',
    sep:        ',',
    leftOpacity: 0.4,
});
van.add(document.body, tuner2);


const freq3 = van.state(2400000000);
const tuner3 = Tuner({
    freqState: freq3,
    ndigits:    12,
    fontSize:   '80px',
    sep:        '.',
    suffix:     " Hz",
    leftOpacity: 0.1,
});
van.add(document.body, tuner3);

