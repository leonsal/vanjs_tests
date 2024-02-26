import van from "./van-1.2.8.debug.js"
import Tuner  from "./tuner.js"
const {div, p, select, hr} = van.tags;

const title = div(p("Tuner Tests"), hr());;
van.add(document.body, title);

const freq = van.state(4567);
const tuner1 = Tuner({ndigits:6, freq});
van.add(document.body, tuner1);
