import Jstore from './jstore';

export default class Header {
    jstore: Jstore;
    name: string;

    constructor(jstore: Jstore, header: string) {
        this.jstore = jstore;
        this.name = header;
    }

    public set(key: any, value: any) {
        this.jstore.set(this.name, key, value);
    }

    public get(key: any) {
        return this.jstore.get(this.name, key);
    }

    public delete(key: any = null) {
        this.jstore.delete(this.name, key);
    }

    public clear() {
        this.jstore.clear(this.name);
    }

    public push(key: any, value: any | any[]) {
        this.jstore.push(this.name, key, value);
    }

    public pop(key: any) {
        this.jstore.pop(this.name, key);
    }

    public incr(key: any, value: number = 1) {
        return this.jstore.incr(this.name, key, value);
    }

    public decr(key: any, value: number = 1) {
        return this.jstore.decr(this.name, key, value);
    }

    public exists(key: any): boolean {
        return this.jstore.keyExists(this.name, key);
    }

    public entries(): object {
        return this.jstore.parseHeader(this.name)[this.name]
    }

}