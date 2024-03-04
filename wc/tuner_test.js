import dom from "./dom.js"
import Tuner from "./tuner.js"
const {button, div, h1, p, label, hr, "my-tuner": myTuner} = dom.tags;

const tuner1 = new Tuner();
tuner1.ndigits = 4;
tuner1.frequency = 123;
tuner1.fontSize = '60px';
tuner1.addEventListener('frequency', () => {
    dom.id("freq").textContent = tuner1.frequency.toString();
});

const tuner2 = new Tuner();
tuner2.ndigits = 8;
tuner2.frequency = 230_445;
tuner2.sep = ',';
tuner2.fontSize = '72px';
tuner2.leftOpacity = 0.4;

const tuner3 = new Tuner();
tuner3.ndigits = 12;
tuner3.frequency = 2_400_000_000;
tuner3.sep = '.';
tuner3.fontSize =  '80px';
tuner3.suffix =     ' Hz';
tuner3.leftOpacity = 0.1;

const tuner4 = myTuner({
    ndigits:        10,
    frequency:      420_000_000,
    sep:            '|',
    'font-size':    '42px',
    suffix:         ' MHz',
    leftOpactity:   0.2,
});


export const tunerTest = () => div(
    button({ onclick: () => {tuner1.frequency++}, }, "Inc"),
    button({ onclick: () => {tuner1.frequency--}, }, "Dec"),
    label(" frequency: "), label({id: "freq"}, tuner1.frequency), p(),
    tuner1, p(),
    tuner2, p(),
    tuner3, p(),
    tuner4
)

