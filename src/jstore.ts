import * as fs from 'fs';
import { join } from 'path';
import Parser from './parser';
import Header from './header';

export class Jstore extends Parser {
    private filepath: string;

    constructor(name: string, path = process.cwd()) {
        super(name, path);

        this.filepath = join(path, this.filename);

        if(!fs.existsSync(this.filepath))
            fs.writeFileSync(this.filepath, '');
    }

    /**
     * sets a key and a value to the given header.
     * @param {string} header 
     * @param {string|object} key 
     * @param {*} value Value can be omitted if the key is an object letting you set several key values at once.
     * @return {Header} Returns the given header as a class.
     */
    
    public set(header: string, key: any, value: any = null): Header {
        this.parse();

        if(!this.index.headers[header])
            this.index.headers[header] = {}

        if(typeof key === 'object' && !value && !Array.isArray(value)) {
            for(const [k, v] of Object.entries(key)) {
                this.index.headers[header][k] = v
            }
        } else this.index.headers[header][key] = value;

        this.write();

        return new Header(this, header);
    }

    /**
     * Gets a key from a given header if no key is given then it will return the header as a class.
     * @param {string} header 
     * @param {*} key 
     */

    public get(header: string, key: any = null): (Header | null) {
        const parsedHeader = this.parseHeader(header);

        if(key === null)
            return new Header(this, header);

        if(!parsedHeader[header]?.[key])
            return null;

        return parsedHeader[header][key];
    }

    /**
     * if no key is provided then it will delete the given header.
     * @param {string} header
     * @param {string} key 
     */
    public delete(header: string, key: any = null) {
        this.parse();

        if(!key)
            delete this.index.headers[header];
        else 
            delete this.index.headers[header][key];
        
        this.write();
    }

     /**
     * clears all keys from the given header.
     * @param {string} header 
     * @return {Header} returns the given header as a class.
     */
    public clear(header: string): (Header | null) {
        this.parse();

        if(this.index.headers[header]) {
           this.index.headers[header] = {};
           this.write();
           
           return new Header(this, header)
        }
        
        return null;
    }

    /**
     * Pushes a value to a given key if it is an array.
     * @param {string} header 
     * @param {string} key 
     * @param {*} value 
     */
    public push(header: string, key: any, value: any | any[]) {
        this.parse();

        let index: any[] = this.index.headers[header][key];

        if(!Array.isArray(index))
            return null;

        index.push(value);

        this.write();

        return index;
    }

    /**
     * Pops a value from the end of an array
     * @param {string} header 
     * @param {string} key 
     */
    public pop(header: string, key: any) {
        this.parse();

        let index = this.index.headers[header][key];

        if(!Array.isArray(index))
            return null;

        index.pop();

        this.write();

        return index;
    }

    /**
     * Increases the value of a key by a given numerical value.
     * @param {string} header 
     * @param {*} key 
     * @param {number} value Default value is 1.
     * @return {number} returns the value of the key after the incrementation.
     */
    public incr(header: string, key: any, value: number = 1): (number | null) {
        this.parse();

        if(!this.index.headers[header]?.[key]) {
            let index = this.index.headers[header];
            !index ? this.index.headers[header] = {} : null;
            
            value = this.index.headers[header][key] = value;

            this.write();

            return value;
        }
        
        let index = this.index.headers[header][key];

        if(isNaN(index))
            return null;

        this.index.headers[header][key] += value;

        this.write();

        return index + value;
    }

     /**
     * decreases the value of a key by a given numerical value.
     * @param {string} header 
     * @param {*} key 
     * @param {number} value Default value is 1.
     * @return {number} returns the value of the key after the decrementation.
     */
    public decr(header: string, key: any, value: number = 1): (number | null) {
        this.parse();
       
        if(!this.index.headers[header]?.[key]) {
            let index = this.index.headers[header];
            !index ? this.index.headers[header] = {} : null;
            
            value = this.index.headers[header][key] = -value;

            this.write();

            return value;
        }

        let index = this.index.headers[header][key];

        if(isNaN(index))
            return null;

        this.index.headers[header][key] -= value;

        this.write();
        
        return index - value;
    }

     /**
     *  creates a header if it does not exist.
     * @param {string} header 
     * @return Returns the working header as a class
     */
    public createHeader(header: string) {
        this.parse();

        // will only create the header if it exists
        if(!this.index.headers[header]) {
            this.index.headers[header] = {};
            this.write();
        }

        return new Header(this, header);
    }

    /**
     * Returns true if the given header exists.
     * @param {string} header 
     * @return {boolean}
     */
    public headerExists(header: string): boolean {
        const parsedHeader = this.parseHeader(header);

        if(parsedHeader[header])
            return true;
       
        return false;
    }

    /**
     * Returns true if the given header exists.
     * @param {string} header 
     * @param {string} key 
     * @return {boolean}
     */
    public keyExists(header: string, key: any): boolean {
        const parsedHeader = this.parseHeader(header);

        if(parsedHeader[header][key])
            return true;
       
        return false;
    }

    /**
     * Gets all the keys and values from a header as an object
     * @param {string} header 
     * @return {object}
     */
    public entries(header: string): (object | null) {
        const parsedHeader = this.parseHeader(header)[header];

        if(!parsedHeader)
            return null;

        return parsedHeader;
    }

    /**
     * returns all an array of all key value pairs that match the given key paramater
     * @param {string} key 
     */
    public findKeys(key: any) {
        const file = this.rawFile();

        let keys = [];

        for(let i = 0; i !== file.length; i++) {
            const line = file[i];

            const formatedKey = this.formatKey(line);
            const formatedValue = this.formatValue(line);

            if(formatedKey === key)
                keys.push({[formatedKey]: formatedValue});
        }

        if(!keys.length)
            return null;

        return keys;
    }

    /**
     * returns all headers that match the given paramater (includes it in the header name not exact match)
     * @param {string | RegExp} header
     * @returns {Array<Header>} 
     */
    public findHeaders(header: string | RegExp) {
        const file = this.rawFile();

        let headers = [];

        for(let i = 0; i !== file.length; i++) {
            const line = file[i];

            if(this.isHeader(line)) {
                const formatedHeader = line.slice(1, -1);

                if(header instanceof RegExp) {
                    if(formatedHeader.match(header))
                        headers.push(new Header(this, formatedHeader));
                }
                else {
                    if(formatedHeader.includes(header))
                        headers.push(new Header(this, formatedHeader));
                }
            }
        }

        if(!headers.length)
            return null;

        return headers;
    }

    /**
     * Returns an array of all headers in the file as classes.
     * @returns {Array}
     */
    public get headers(): Array<any> {
        this.parse();
        
        let headerArray: Header[] = [];

        const key = Object.keys(this.index.headers);
        for(let i = 0; i !== key.length; i++) 
            headerArray.push(new Header(this, key[i]));
        
        return headerArray;
    }

    /**
     * Returns the total amount of headers in the jstore file.
     * @return {number}
     */
    public get length(): number {
        this.parse();
        return Object.keys(this.index.headers).length;
    }

    // parse() should always be called before this method or else it wont work correctly
    private write() {
        try {
            fs.writeFileSync(this.filepath, this.parseObject());
        } catch(err) {
            console.log(`Error writing to file ${err}`);
        }
    }
}