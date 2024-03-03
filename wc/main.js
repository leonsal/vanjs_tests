import dom from "./dom.js"
import {List, ListItem} from "./list.js"

const {button, div, input, span, i, h1, p, label, hr} = dom.tags;

const test = (newItem) => {

    // Creates List component and sets 'change' handler
    const list = new List();
    // list.style.borderWidth = '2px';
    // list.style.borderStyle = 'solid';
    list.addEventListener('change', () => {
        console.log("list changed");
    });

    const inputText = input({placeholder: "New item"});
    const inputCheck = input({
        type:   "checkbox",
        id:     "multi",
        onchange: (ev) => list.multiSelect = ev.target.checked,
    });

    return div(
        inputText, span(" "),
        button({
                onclick: () => {
                    const item = new ListItem();
                    newItem(item, inputText.value);
                    list.appendChild(item);
                },
            },
            "Insert"
        ),
        span(" "),
        inputCheck,
        label({for:"multi"}, "multi select"), span(" "),
        button({
                onclick: () => {
                    const selected = list.selected;
                    for (let i = 0; i < selected.length; i++) {
                        list.removeChild(selected[i]);
                    }
                },
            },
            "Remove selected"
        ), span(" "),
        button({onclick: () => list.clear()}, "Clear all"), span(" "),
        button({onclick: () => list.unselect()}, "Unselect all"),
        hr(),
        list,
    )
}

dom.add(document.body, test((item, text) => {

    item.value = "["+text+"]";
}));

// dom.add(document.body, test((item, text) => {
//
//     const dtime = new Date().toISOString().slice(11,23);
//     item.value = span(i({style: 'color: blue'},dtime), ":  ", text);
// }));


