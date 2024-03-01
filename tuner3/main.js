import Tuner from "./tuner.js"
import dom from "./dom.js"

const {button, div, h1, p, label, hr} = dom.tags;

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

const header = div(
    h1("Tuner Web Component component tests"),
    hr(),
    button({ onclick: () => {tuner1.frequency++}, }, "Inc"),
    button({ onclick: () => {tuner1.frequency--}, }, "Dec"),
    label(" frequency: "), label({id: "freq"}, tuner1.frequency),
);

dom.add(document.body, header, tuner1, p(), tuner2, p(), tuner3);
