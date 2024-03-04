import dom from "./dom.js"
import {HSplitter} from "./splitter.js"

const {button, div, input, span, i, h1, p, label, hr} = dom.tags;

export const hsplitterTest = () => {

    const sp1 = new HSplitter();
    sp1.left = div(
        p("This is"),
        p("the left pane"),
        p("of the Splitter"),
        button("OK"),
    );
    sp1.right = div(
        p("This is"),
        p("the right pane"),
        p("of the Splitter"),
        button("OK"),
    );

    return sp1;
}

