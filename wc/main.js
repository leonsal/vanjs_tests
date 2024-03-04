import dom from "./dom.js"
import {tunerTest} from "./tuner_test.js"
import {listTestStr, listTestSpan} from "./list_test.js"
import {hsplitterTest} from "./splitter_test.js"
const {button, div, input, select, span, i, h1, h2, p, label, option, hr} = dom.tags;

// Globals
const testList = []; // List of {title, func}
let lastTest = null;

// Show drop down for selecting demo to run
function testSelect() {

    const TestSelect = () => div(

        h2("Web Component Tests"),
        select({onchange:(ev) => {
                // Get index of selected option
                const index = ev.target.selectedIndex;
                if (index === undefined) {
                    return;
                }
                // Remove last demo from the DOM
                if (lastTest) {
                    document.body.removeChild(lastTest);
                    lastTest = null;
                }
                // Index 0 corresponds to the 'Select demo option'
                if (index == 0) {
                    return;
                }
                // Calls corresponding demo function
                lastTest = testList[index-1].func();
                dom.add(document.body, lastTest);
            }},
            // Start of select options
            option("Select a test"),
            // Builds array op 'option' from demos titles
            testList.map((it) => option(it.title)),
        ),
        hr(),

    );
    dom.add(document.body, TestSelect())
}

testList.push({title:"List of strings", func: listTestStr});
testList.push({title:"List of <span>", func: listTestSpan});
testList.push({title:"Tuner", func: tunerTest});
testList.push({title:"Horiz Splitter", func: hsplitterTest});
testSelect();

