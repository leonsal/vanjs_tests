import dom from "./dom.js"
import {List, ListItem} from  "./list.js"


const test = () => {

    const {button, div, input, span, h1, p, label, hr} = dom.tags;

    // Creates List component and sets 'change' handler
    const list = new List();
    list.addEventListener('change', (ev) => {
        console.log("list changed", ev);
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
                    item.value = span("[", inputText.value, "]");
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
        button({ onclick: () => list.clear(), }, "Clear all"),
        hr(),
        list,
    )
}

dom.add(document.body, test());

// const test = div({
//         class: "flexRow",
//     },
//     button({style: 'width:100px;'}, "1"),
//     button({style: 'width:100px;'}, "2"),
//     button({style: 'width:100px;'}, "3"),
//     button({style: 'width:100px;'}, "4"),
// )
// dom.add(document.body, test);


