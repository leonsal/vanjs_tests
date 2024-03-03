import van from "./van-1.2.8.debug.js"

// Globals
const demos = []; // List of {title, func}
let lastDemo = null;

// Show drop down for selecting demo to run
function demoSelect() {
    const {div, p, select, option, hr} = van.tags;
    // const currentDemoIdx = van.state(0);
    const DemoSelect = () => div(
        p("VanJS Demos"),
        select({onchange:(ev) => {

                // Get index of selected option
                const index = ev.target.selectedIndex;
                if (index === undefined) {
                    return;
                }
                // Remove last demo from the DOM
                if (lastDemo) {
                    document.body.removeChild(lastDemo);
                    lastDemo = null;
                }
                // Index 0 corresponds to the 'Select demo option'
                if (index == 0) {
                    return;
                }
                // Calls corresponding demo function
                lastDemo = demos[index-1].func();
            }},
            // Start of select options
            option("Select a demo"),
            // Builds array op 'option' from demos titles
            demos.map((it) => option(it.title)),
        ),
        hr(),

    );
    van.add(document.body, DemoSelect())
}

//
// DOM race
//
function demo1() {
    const {button, div, pre} = van.tags;
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const Run = ({sleepMs}) => {
        const steps = van.state(0);
        (async () => {
            for (; steps.val < 40; ++steps.val) {
                await sleep(sleepMs) 
            }
        })()
        return pre(
            () => `${" ".repeat(40 - steps.val)}🚐💨Hello VanJS!${"_".repeat(steps.val)}`
        )
    }

    const Hello = () => {
        const dom = div()
        return div(
            dom,
            button({onclick: () => van.add(dom, Run({sleepMs: 2000}))}, "Hello 🐌"),
            button({onclick: () => van.add(dom, Run({sleepMs: 500}))}, "Hello 🐢"),
            button({onclick: () => van.add(dom, Run({sleepMs: 100}))}, "Hello 🚶‍♂️"),
            button({onclick: () => van.add(dom, Run({sleepMs: 10}))}, "Hello 🏎️"),
            button({onclick: () => van.add(dom, Run({sleepMs: 2}))}, "Hello 🚀"),
        )
    }
    const demo = Hello();
    van.add(document.body, demo)
    return demo;
}
demos.push({title:"DOM race", func: demo1});

//
// Hello demo
//
function demo2() {
    const {a, div, li, p, ul} = van.tags
    const Hello = () => div(
        p("Hello"),
        ul(
            li("World"),
            li(a({href: "https://vanjs.org/"}, "🍦VanJS")),
        ),
    )
    const demo = Hello();
    van.add(document.body, demo)
    return demo;
}
demos.push({title:"Hello", func: demo2});

//
// Smiley SVG URI
//
function demo3() {
    const {circle, path, svg} = van.tagsNS("http://www.w3.org/2000/svg")
    const Smiley = () => svg({width: "16px", viewBox: "0 0 50 50"},
        circle({cx: "25", cy: "25", "r": "20", stroke: "black", "stroke-width": "2", fill: "yellow"}),
        circle({cx: "16", cy: "20", "r": "2", stroke: "black", "stroke-width": "2", fill: "black"}),
        circle({cx: "34", cy: "20", "r": "2", stroke: "black", "stroke-width": "2", fill: "black"}),
        path({"d": "M 15 30 Q 25 40, 35 30", stroke: "black", "stroke-width": "2", fill: "transparent"}),
    )
    const demo = Smiley();
    van.add(document.body, demo)
    return demo;
}
demos.push({title:"SVG Smiley", func: demo3});

//
// MathML
//
function demo4() {
    const {div} = van.tags;
    const {math, mi, mn, mo, mrow, msup} = van.tagsNS("http://www.w3.org/1998/Math/MathML")
    const Euler = () => div(
        math(msup(mi("e"), mrow(mi("i"), mi("π"))), mo("+"), mn("1"), mo("="), mn("0"))
    )
    const demo = Euler();
    van.add(document.body, demo)
    return demo;
}
demos.push({title:"MathML", func: demo4});

//
// Bullet list functional style
//
function demo5() {
    const {li, ul} = van.tags
    const List = ({items}) => ul(items.map(it => li(it)))
    const demo = List({items: ["Item 1", "Item 2", "Item 3"]})
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"Bullet list", func: demo5});


//
// Table
//
function demo6() {
    const {table, tbody, thead, td, th, tr} = van.tags
    const Table = ({head, data}) => table(
      head ? thead(tr(head.map(h => th(h)))) : [],
      tbody(data.map(row => tr(
        row.map(col => td(col)),
      ))),
    )

    const demo = Table({
        head: ["ID", "Name", "Country"],
        data: [
            [1, "John Doe", "US"],
            [2, "Jane Smith", "CA"],
            [3, "Bob Johnson", "AU"],
        ],
    });
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"Table", func: demo6});

//
// Button onclick
//
function demo7() {
    const {div, button} = van.tags
    const demo = div(
        button({onclick: () => alert("Hello from VanJS")}, "Hello")
    )
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"Button onclick", func: demo7});


//
// State
//
function demo8(){
    const {button, div, input, sup} = van.tags
    // Create a new state object with init value 1
    const counter = van.state(1)

    // Log whenever the value of the state is updated
    van.derive(() => console.log(`Counter: ${counter.val}`))

    // Derived state
    const counterSquared = van.derive(() => counter.val * counter.val)

    // Used as a child node
    const dom1 = div(counter)

    // Used as a property
    const dom2 = input({type: "number", value: counter, disabled: true})

    // Used in a state-derived property
    const dom3 = div({style: () => `font-size: ${counter.val}em;`}, "Text")

    // Used in a state-derived child
    const dom4 = div(counter, sup(2), () => ` = ${counterSquared.val}`)

    // Button to increment the value of the state
    const incrementBtn = button({onclick: () => ++counter.val}, "Increment")
    const resetBtn = button({onclick: () => counter.val = 1}, "Reset")

    const demo = div(incrementBtn, resetBtn, dom1, dom2, dom3, dom4);
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"State", func: demo8});


//
// Derived state
//
function demo9() {
    const {input, span} = van.tags
    const DerivedState = () => {
        const text = van.state("VanJS")
        const length = van.derive(() => text.val.length)
        return span(
            "The length of ",
            input({type: "text", value: text, oninput: e => text.val = e.target.value}),
            " is ", length, ".",
        )
    }
    const demo = DerivedState();
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"Derived state", func: demo9});

//
// Derive state side effect
//
function demo10() {
    const {button, span} = van.tags
    const Counter = () => {
      const counter = van.state(0)
      van.derive(() => console.log("Counter: ", counter.val))
      return span(
        "❤️ ", counter, " ",
        button({onclick: () => ++counter.val}, "👍"),
        button({onclick: () => --counter.val}, "👎"),
      )
    }
    const demo = Counter();
    van.add(document.body, demo)
    return demo;
}
demos.push({title:"Derived state side-effect", func: demo10});

//
// State binding
//
function demo11() {
    const {input, span} = van.tags
    const ConnectedProps = () => {
      const text = van.state("")
      return span(
        input({type: "text", value: text, oninput: e => text.val = e.target.value}),
        input({type: "text", value: text, oninput: e => text.val = e.target.value}),
      )
    }
    const demo = ConnectedProps();
    van.add(document.body, demo)
    return demo;
}
demos.push({title:"State binding", func: demo11});


//
// State objects as child nodes
//
function demo12() {
    const {button, span} = van.tags
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const Timer = ({totalSecs}) => {
        const secs = van.state(totalSecs)
        return span(
            secs, "s ",
            button({onclick: async () => {
                while (secs.val > 0) await sleep(1000), --secs.val
                    await sleep(10) // Wait briefly for DOM update
                    alert("⏰: Time is up")
                    secs.val = totalSecs
                }
            }, "Start"),
        )
    }
    const demo = Timer({totalSecs:5})
    van.add(document.body, demo)
    return demo;
}
demos.push({title:"State objects as child nodes", func: demo12});

//
// State-derived properties
//
function demo13() {
    const {input, option, select, span} = van.tags
    const FontPreview = () => {
        const size = van.state(16), color = van.state("black")
        return span(
            "Size: ",
            input({type: "range", min: 10, max: 36, value: size, oninput: e => size.val = e.target.value}),
            " Color: ",
            select({oninput: e => color.val = e.target.value, value: color}, ["black", "blue", "green", "red", "brown"] .map(c => option({value: c}, c)),),
            // The <span> element below has a state-derived property `style`
            span({style: () => `font-size: ${size.val}px; color: ${color.val};`}, " Hello 🍦VanJS"),
        )
    }
    const demo = FontPreview();
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"State-derived properties", func: demo13});

//
// van._(...) to escape on... event handlers
//
function demo14() {
    const {button, option, select, span} = van.tags
    const Counter = () => {
        const counter = van.state(0)
        const action = van.state("👍")
        return span(
            "❤️ ", counter, " ",
            select({oninput: e => action.val = e.target.value, value: action},
                option({value: "👍"}, "👍"),
                option({value: "👎"}, "👎"),
            ), " ",
            button({onclick: van._(() => action.val === "👍" ? () => ++counter.val : () => --counter.val)}, "Run"),
        )
    }
    const demo = Counter();
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"van_() to escape event handlers", func: demo14});

//
// State derived child nodes
//
function demo15() {
    const {input, li, option, select, span, ul} = van.tags
    const SortedList = () => {
        const items = van.state("a,b,c"), sortedBy = van.state("Ascending")
        return span(
            "Comma-separated list: ",
            input({oninput: e => items.val = e.target.value, type: "text", value: items}), " ",
            select({oninput: e => sortedBy.val = e.target.value, value: sortedBy},
                option({value: "Ascending"}, "Ascending"),
                option({value: "Descending"}, "Descending"),
            ),
            // A State-derived child node
            () => sortedBy.val === "Ascending" ?
            ul(items.val.split(",").sort().map(i => li(i))) :
            ul(items.val.split(",").sort().reverse().map(i => li(i))),
        )
    }
    const demo = SortedList();
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"State-derived child nodes", func: demo15});

//
// Removing a DOM node
//
function demo16() {
    const {a, button, div, input, li, ul} = van.tags
    const ListItem = ({text}) => {
        const deleted = van.state(false)
        return () => deleted.val ? null : li( text, a({onclick: () => deleted.val = true}, "❌"),)
    }

    const EditableList = () => {
        const listDom = ul()
        const textDom = input({type: "text"})
        return div(
            textDom, " ",
            button({onclick: () => van.add(listDom, ListItem({text: textDom.value}))}, "➕"),
            listDom,
        )
    }
    const demo = EditableList();
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"Removing a DOM node", func: demo16});

//
// Polymorphic binding
//
function demo17() {
    const {button, span} = van.tags
    const Button = ({color, text, onclick}) =>
        button({style: () => `background-color: ${van.val(color)};`, onclick}, text)

    const App = () => {
        const colorState = van.state("green")
        const textState = van.state("Turn Red")
        const turnRed = () => {
            colorState.val = "red"
            textState.val = "Turn Green"
            onclickState.val = turnGreen
        }
        const turnGreen = () => {
            colorState.val = "green"
            textState.val = "Turn Red"
            onclickState.val = turnRed
        }
        const onclickState = van.state(turnRed)

        return span(
            Button({color: "yellow", text: "Click Me", onclick: () => alert("Clicked")}), " ",
            Button({color: colorState, text: textState, onclick: onclickState}),
        )
    }
    const demo = App();
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"Polymorphic binding", func: demo17});


function myList() {

    const {div, input, button, p, label, span} = van.tags

    const listItem = ({time, log}) => {

        const selected = van.state(false)
        const mouseover = van.state(false)
        const itemStyle = () => {
            if (selected.val) {
                return mouseover.val ? "background-color: gray" : "background-color: lightgray"
            }
            return mouseover.val ? "background-color: lightgray" : "background-color: white"
        }

        const onSelect = (ev) => {
            const item = ev.target;
            const multi = item.parentNode.getAttribute("data-multi");
            if (multi == 'false') {


            }
            selected.val = true;
        }

        return div({
                style:          itemStyle,
                onclick:        onSelect,
                onmouseover:    () => mouseover.val = true,
                onmouseout:     () => mouseover.val = false,
            },
            label(time),
            span(" - "),
            label(log)
        );
    }


    const MyList = ({multi}) => {

        return div({
                "data-multi": multi,
                style: "border-style: solid; border-width: 1px",
            },
        );
    }

    const test = () => {
        const listDom = MyList({multi:true});
        const inputDom = input({type: "text"})
        return div(
            inputDom,
            button({
                    onclick: () => van.add(listDom, listItem({time:"xx", log:inputDom.value})),
                },"➕" 
            ),
            p(),
            listDom,
        )
    }

    const demo = test();
    van.add(document.body, demo);
    return demo;
}
demos.push({title:"myList", func: myList});


//-----------------------------------------------------------------------------
// Show demo selection
//-----------------------------------------------------------------------------
demoSelect();

