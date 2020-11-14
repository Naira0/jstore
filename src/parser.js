const { readFileSync } = require('fs');

module.exports = class Parser {
    constructor(filename, path = process.cwd) {
        // Stores all the parsed headers and their content.
        this.index = {headers: {}};
        // header block stores the current header in the file so all the values can be read to that header.
        this.headerBlock;
        this.singleHeader = {};
        this.filename = filename.endsWith('.jstore') ? filename : filename + '.jstore';
        this.path = path();
    }

    /**
     * parses the working jstore file into a javascript object
     * @return {object} 
     */
    parse() {

        // reads file and removes empty lines then it splits it into an array by the new lines.
        const file = readFileSync(this.path + '\\' + this.filename, 'utf-8').replace(/^\s\n/gm, "");
        let lines = file.split('\n');

        for(let i = 0, line; i !== lines.length; i++) {
            line = lines[i];
            
            if(line.startsWith('[') && line.endsWith(']')) {
                const header = line.slice(1, -1);

                this.index.headers[header] = {};
                this.headerBlock = header;

                continue;
            }

            const arrayFormat = line.slice(line.indexOf('[') + 1, -1).split(',');
            const key = line !== '' ? line.slice(0, line.indexOf('=')).trim() : null;
            let value = !this.isArray(line) ? line.slice(line.indexOf('=') + 1).trim() : arrayFormat;

            switch(value) {
                case 'true':
                    value = true
                break;
                case 'false':
                    value = false;
                break;
            }

            if(!isNaN(value) && typeof value !== 'boolean') {
                if(value % 1 === 0)
                    value = parseInt(value);
                if(value % 1 !== 0)
                    value = parseFloat(value);
            }
            
            if(key !== null)
                this.index.headers[this.headerBlock][key] = value;
        }
        return this.index
    }

    /**
     * Parses a given object to a jstore format. the object must meet strict formatting rules. format: `obj = headers: { myHeader: { k1: 'v'}}`
     * @param {object} object by default this will be the parsed working jstore file.
     * @return {string} returns the object as a jstore format
     */
    parseObject(object = this.index) {
        let jstoreFormat = '';
        
        if(!Object.keys(object).includes('headers')) 
            throw 'The object must be in the format of headers: { header_objects... }';

        const formatValues = obj => {
            let values = '';

            // using this method instead of Object.entries(obj) due to the slight performance increase 
            const key = Object.keys(obj)
            for(let i = 0, value; i <= key.length; i++) {
                value = obj[key[i]];

                if(typeof value === 'undefined') continue;

                switch(value) {
                    case true:
                        value = 'true'
                    break;
                    case false:
                        value = 'false';
                    break;
                }

                values += `${key[i]} = ${Array.isArray(value) ? '[' + value + ']' : value}\n`
            }
            return values;
        }

        for(const [key, value] of Object.entries(object.headers)) {
            let header;
            let kv;

            if(typeof value === 'object') {
                header = `\n[${key}]`;
                kv = formatValues(value);
            }

            jstoreFormat += `${header}\n${kv}`;
        }
        return jstoreFormat;
    }

    /**
     * finds and parses a single header to an object instead of the entire file.
     * @param {string} target the target header to parse.
     */
    parseHeader(target) {
        const file = readFileSync(this.path + '\\' + this.filename, 'utf-8').replace(/^\s\n/gm, "");
        let lines = file.split('\n');

        
        let header;

        for(let i = 0, line; i !== lines.length; i++) {
            line = lines[i];

            if(line.startsWith('[') && line.endsWith(']') && line.includes(target) && header !== target) {
                header = line.slice(1, -1);
                this.singleHeader[header] = {};
                continue;
            }

            if(typeof header === 'undefined')
                continue;

            if(line.startsWith('[') && line.endsWith(']'))
                break;

            const arrayFormat = line.slice(line.indexOf('[') + 1, -1).split(',');
            const key = line !== '' ? line.slice(0, line.indexOf('=')).trim() : null;
            let value = !this.isArray(line) ? line.slice(line.indexOf('=') + 1).trim() : arrayFormat;

            switch(value) {
                case 'true':
                    value = true
                break;
                case 'false':
                    value = false;
                break;
            }

            if(!isNaN(value) && typeof value !== 'boolean') {
                if(value % 1 === 0)
                    value = parseInt(value);
                if(value % 1 !== 0)
                    value = parseFloat(value);
            }
            
            if(key !== null)
                this.singleHeader[header][key] = value;
        }
        return this.singleHeader;
    }

    // checks if a string is an array inside a jstore file.
    isArray(line) {
        const formated = line.slice(line.indexOf('=') + 1).trim();
        if(formated.startsWith('[') && formated.endsWith(']'))
            return true;
    }

}