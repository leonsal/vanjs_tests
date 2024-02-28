import Tuner from "./tuner.js"

function createTest() {

    const test = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.textContent = "Tuner2 tests";
    test.appendChild(h1);

    const hr = document.createElement("hr");
    test.appendChild(hr);

    const b1 = document.createElement("button");
    b1.textContent = "Inc";
    b1.onclick = () => {
        tuner1.frequency++;
    }
    test.appendChild(b1);

    const b2 = document.createElement("button");
    b2.textContent = "Dec";
    b2.onclick = () => {
        tuner1.frequency--;
    }
    test.appendChild(b2);

    const span = document.createElement("span");
    span.textContent = " frequency: ";
    test.appendChild(span);

    const label = document.createElement("label");
    label.textContent = "";
    test.appendChild(label);
    return {test, label};
}

const {test, label} = createTest();
document.body.appendChild(test);


const tuner1 = new Tuner({
    frequency:  123,
    ndigits:    4,
    fontSize:   '64px',
});
tuner1.addEventListener('frequency', () => {
    label.textContent = tuner1.frequency.toString();
});
document.body.appendChild(tuner1.el);

const tuner2 = new Tuner({
    frequency:  230445,
    ndigits:    8,
    sep:        ',',
    fontSize:   '72px',
    leftOpacity: 0.4,
});
document.body.appendChild(tuner2.el);

const tuner3 = new Tuner({
    frequency:  2400000000,
    ndigits:    12,
    sep:        '.',
    fontSize:   '80px',
    suffix:     ' Hz',
    leftOpacity: 0.1,
});
document.body.appendChild(tuner3.el);


