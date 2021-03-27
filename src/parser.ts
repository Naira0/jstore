import { readFileSync } from 'fs';
import { join } from 'path';

export default class Parser {
    public index: any;
    public filename: string;
    private path: string;

    constructor(filename: string, path: string = process.cwd()) {
        this.index = {headers: {}};
        this.filename = filename.endsWith('.jstore') ? filename : filename + '.jstore';
        this.path = path;
    }
    
    public parse() {
       
        const file = readFileSync(join(this.path, this.filename), 'utf-8')
        .replace(/^\s\n/gm, "")
        .replace(/\r/g, "")
        .split('\n');

        let headerBlock = '';

        for(let i = 0; i !== file.length; i++) {

            const line = file[i];

            // checks if the line is a header and if it is it sets it as the current working header block and adds it to the index
            if(this.isHeader(line)) {
                const header = line.slice(1, -1);

                this.index.headers[header] = {};
                headerBlock = header;

                continue;
            }

            const key = this.formatKey(line);

            if(!key)
                continue;

            let value = this.formatValue(line);

            // checks if the value is either true or false and if so it will set them to an actual boolean instead of a string
            if(value === 'true' || value === 'false') 
                value === 'true' ? value = true : value = false

            // checks if the value is a number and not a boolean and if so it parses it either to an int or a float
            if(!isNaN(value) && typeof value !== 'boolean') 
                value % 1 === 0 ? value = parseInt(value) : value = parseFloat(value);

            this.index.headers[headerBlock][key] = value;
        }
    }

    public parseObject() {
        let jstore = '';
        
        // formats the key and values of an object into a jstore format
        // does not account for nested objects but that should not be a problem
        const formatObject = (obj: any) => {
            let formated = '';

            for(const [key, value] of Object.entries(obj)) {

                if(typeof value === 'undefined')
                    continue;

                formated += `${key} = ${Array.isArray(value) ? `[${value}]` : value}\n`;
            }

            return formated;
        }

        // loops over the entries of all the headers and formats them to the jstore format
        for(const [key, value] of Object.entries(this.index.headers)) {

            if(typeof value !== 'object')
                continue;

            jstore += `\n[${key}]\n${formatObject(value)}`;
        }

        return jstore;
    }

    // is almost identical to parse() except a few key changes that makes it only look for a single header to parse 
    // i could have combined this with parse() but decided to keep it as a seperate function to not make it overly complex 
    public parseHeader(target: string) {
        const file = readFileSync(join(this.path, this.filename), 'utf-8')
        .replace(/^\s\n/gm, "")
        .replace(/\r/g, "")
        .split('\n');

        let header = '';
        let obj: any = {};

        const _parsedHeader = (header: string) => header.slice(1, -1);

        for(let i = 0; i !== file.length; i++) {
            const line = file[i];

            const parsedHeader = _parsedHeader(line);

            // checks if the line is a header and if so sets it as the working header
            if(this.isHeader(line) && parsedHeader === target) {
                header = parsedHeader;
                obj[header] = {};

                continue;
            }

            if(header === '' || typeof header === 'undefined')
                continue;

            if(this.isHeader(line) && header !== '')
                break;
                
            const key = this.formatKey(line);

            if(!key)
                continue;

            let value = this.formatValue(line);

            // checks if the value is either true or false and if so it will set them to an actual boolean instead of a string
            if(value === 'true' || value === 'false') 
                value === 'true' ? value = true : value = false

            // checks if the value is a number and not a boolean and if so it parses it either to an int or a float
            if(!isNaN(value) && typeof value !== 'boolean') 
                value % 1 === 0 ? value = parseInt(value) : value = parseFloat(value);

                obj[header][key] = value;
        }

        return obj;
    }

    public rawFile() {
        return readFileSync(join(this.path, this.filename), 'utf-8')
        .replace(/^\s\n/gm, "")
        .replace(/\r/g, "")
        .split('\n');
    }

    protected formatArray(str: string): any[] {
        return str.slice(str.indexOf('[') + 1, -1).split(',');
    }

    protected formatKey(str: string): any {
        return str !== '' ? str.slice(0, str.indexOf('=')).trim() : null
    }
    
    protected formatValue(str: string): any {
        const value = str.slice(str.indexOf('=') + 1).trim();
        return this.isArray(value) ? this.formatArray(value) : value;
    }

    // both isArray and isHeader are identical but i there is two of them for readibility 
    protected isArray(str: string): boolean {
        return str.startsWith('[') && str.endsWith(']') ? true : false;
    }

    protected isHeader(str: string): boolean {
        return str.startsWith('[') && str.endsWith(']') ? true : false;
    }
}