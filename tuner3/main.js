import Tuner from "./tuner.js"

function createTest() {

    const title = "Tuner3 Web Component tests"
    document.title = title;

    const test = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.textContent = title;
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


const tuner1 = new Tuner();
tuner1.ndigits = 4;
tuner1.frequency = 123;
tuner1.fontSize = '64px';
document.body.appendChild(tuner1);

document.body.appendChild(document.createElement("p"));

const tuner2 = new Tuner();
tuner2.ndigits = 8;
tuner2.frequency = 230445;
tuner2.sep = ',';
tuner2.fontSize = '72px';
tuner2.leftOpacity = 0.4;
document.body.appendChild(tuner2);

document.body.appendChild(document.createElement("p"));

const tuner3 = new Tuner();
tuner3.ndigits = 12;
tuner3.frequency = 24000000;
tuner3.sep = '.',
tuner3.fontSize =  '80px',
tuner3.suffix =     ' Hz',
tuner3.leftOpacity = 0.1,
document.body.appendChild(tuner3);


