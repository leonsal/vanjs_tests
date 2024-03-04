import dom from "./dom.js"
import {HSplitter} from "./splitter.js"

const {button, div, input, span, i, h1, p, label, hr} = dom.tags;

export const hsplitterTest = (newItem) => {

    const sp1 = new HSplitter();
    sp1.style.height = '200px';
    sp1.left = 'left';
    sp1.right = 'right';

    return sp1;
}

