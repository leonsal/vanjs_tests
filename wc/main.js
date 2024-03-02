import dom from "./dom.js"

const {button, div, h1, p, label, hr} = dom.tags;


const test = div({
        class: "flexRow",
    },
    button({style: 'width:100px;'}, "1"),
    button({style: 'width:100px;'}, "2"),
    button({style: 'width:100px;'}, "3"),
    button({style: 'width:100px;'}, "4"),
)
dom.add(document.body, test);


