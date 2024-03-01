const Obj = Object;
const protoOf = Obj.getPrototypeOf;
const doc = document;
const alwaysConnectedDom = {isConnected: 1};
const objProto = protoOf(alwaysConnectedDom);
const propSetterCache = {}
//const funcProto = protoOf(protoOf)
let _undefined;

// Adds 'children' to the specified 'dom' element
// Each child can be a DOM element or an array of DOM elements.
const add = (dom, ...children) => {

    for (let c of children.flat(Infinity)) {
        if (c != _undefined) {
            dom.append(c);
        }
    }
    return dom
}

// Creates HTML tags proxy objects
const tagsNS = ns => new Proxy((name, ...args) => {

    let [props, ...children] = protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args]
    let dom = ns ? doc.createElementNS(ns, name) : doc.createElement(name)
    for (let [k, v] of Obj.entries(props)) {
        let getPropDescriptor = proto => proto ?
        Obj.getOwnPropertyDescriptor(proto, k) ?? getPropDescriptor(protoOf(proto)) : _undefined
        let setter = k.startsWith("on") ? (v, oldV) => {
            let event = k.slice(2)
            dom.removeEventListener(event, oldV)
            dom.addEventListener(event, v)
        } : dom.setAttribute.bind(dom, k)
        let protoOfV = protoOf(v ?? 0)
        // protoOfV === funcProto && (!k.startsWith("on") || v._isBindingFunc) && (v = derive(v), protoOfV = stateProto)
        // protoOfV === stateProto ? bind(() => (setter(v.val, v._oldVal), dom)) : setter(v)
        setter(v)
    }
    return add(dom, ...children)
}, {get: (tag, name) => tag.bind(_undefined, name)})

const id = (ids) => document.getElementById(ids);

export default {add, tags: tagsNS(), tagsNS, id}

