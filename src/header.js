module.exports = class Header {
    constructor(parser, header) {
        this.parser = parser;
        this.name = header;
    }

    set(key, value) {
        this.parser.set(this.name, key, value);
    }

    get(key) {
        return this.parser.singleHeader[this.name][key];
    }

    delete(key = null) {
        this.parser.delete(this.name, key);
    }

    clear() {
        this.parser.clear(this.name);
    }

    keyExists(key) {
        this.parser.keyExists(this.name, key);
    }

    push(key, value) {
        this.parser.push(this.name, key, value);
    }

    incr(key, value = 1) {
        this.parser.incr(this.name, key, value);
    }

    decr(key, value = 1) {
        this.parser.decr(this.name, key, value);
    }

    get keys() {
        return this.parser.keys(this.name);
    }

    get values() {
        return this.parser.values(this.name);
    }

    get entries() { 
        return this.parser.singleHeader[this.name];
    }
}