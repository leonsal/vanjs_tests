import Tuner from "./tuner.js"


const tuner1 = new Tuner({
    ndigits: 8,
    sep: '.',
});
tuner1.frequency = 910450;

document.body.appendChild(tuner1.el);


