const fs = require('fs');
const Parser = require('./parser');
const Header = require('./header');

module.exports = class Jstore extends Parser {
    /**
     * A class for setting working with jstore files.
     * @param {string} filename the filename of the jstore file.
     * @param {string} path an optional filepath. if not given it will be set to the current working directory.
    */
    constructor(filename, path = process.cwd) {
        super(filename);

        this.path = path();
        this.dirname = this.path + '\\' + this.filename;

        if(!fs.existsSync(this.dirname))
            fs.writeFileSync(this.dirname, '');
    }

    /**
     * sets a key and a value to the given header.
     * @param {string} header 
     * @param {string|object} key 
     * @param {*} value Value can be omitted if the key is an object letting you set several key values at once.
     * @return {header} Returns the given header as a class.
     */

    set(header, key, value = null) {
        this.parse();

        if(!this.headerExists(header))
            this.index.headers[header] = {}

        if(typeof key === 'object' && value === null && !Array.isArray(value)) {
            for(const [k, v] of Object.entries(key)) {
                this.index.headers[header][k] = v
            }
        }

        else 
            this.index.headers[header][key] = value;

        this.write();

        return new Header(this, header);
    }

    /**
     * Gets a key from a given header if no key is given then it will return the header as a class.
     * @param {string} header 
     * @param {*} key 
     */

    get(header, key = null) {
        this.parse();

        if(key === null)
            return new Header(this, header);

        return this.index.headers[header][key];
    }

    /**
     * if no key is provided then it will delete the given header.
     * @param {string} header
     * @param {string} key 
     */
    delete(header, key = null) {
        this.parse();

        if(key === null)
            delete this.index.headers[header];
        else 
            delete this.index.headers[header][key];
        
        this.write();
    }

    /**
     * clears all keys from the given header.
     * @param {string} header 
     * @return {header} returns the given header as a class.
     */
    clear(header) {
        this.parse();

        if(this.headerExists(header)) {
           this.index.headers[header] = {};
           this.write();
           return new Header(this, header)
        }
        else 
            return undefined;
    }

    /**
     * Pushes a value to a given key if it is an array.
     * @param {string} header 
     * @param {string} key 
     * @param {*} value 
     */
    push(header, key, value) {
        this.parse();

        let index = this.index.headers[header][key];

        if(!Array.isArray(index))
            return null;

        index.push(value);
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
    incr(header, key, value = 1) {
        this.parse();
        
        let index = this.index.headers[header][key];

        if(isNaN(index))
            return;

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
    decr(header, key, value = 1) {
        this.parse();
        
        let index = this.index.headers[header][key];

        if(isNaN(index))
            return;

        this.index.headers[header][key] -= value;

        this.write();
        return index - value;
    }

    /**
     *  creates a header if it does not exist.
     * @param {string} header 
     * @return Returns the working header as a class
     */
    createHeader(header) {
        this.parse();

        if(!this.headerExists(header))
            this.index.headers[header] = {};

        this.write();

        return new Header(this, header);
    }

    /**
     * Returns true if the given header exists.
     * @param {string} header 
     */
    headerExists(header) {
        this.parse();

        if(this.index.headers[header])
            return true;
        else 
            return false;
    }

    /**
     * Returns true if the given header exists.
     * @param {string} header 
     * @param {string} key 
     */
    keyExists(header, key) {
        this.parse();

        if(this.index.headers[header][key])
            return true;
        else
            return false;
    }

    /**
     * Returns all the keys in a given header as an array.
     * @param {string} header 
     */
    keys(header) {
        this.parse();

        if(!this.headerExists(header)) 
            return null;
        
        return Object.keys(this.index.headers[header]);
    }

    /**
     * Returns all the values in a given header as an array.
     * @param {string} header 
     */
    values(header) {
        this.parse();

        if(!this.headerExists(header)) 
            return null;
        
        return Object.values(this.index.headers[header]);
    }
    
    /**
     * Returns an array of all headers in the file as classes.
     */
    headers() {
        this.parse();
        
        let headerArray = [];

        for(const [key, value] of Object.entries(this.index.headers)) 
            headerArray.push(new Header(this, key));
        
        return headerArray;
    }

    /**
     * Returns the total amount of headers in the jstore file.
     */
    get length() {
        this.parse();
        return Object.keys(this.index.headers).length;
    }

    /**
     * Reparses the working jstore file.
     */
    sync() {
        this.parse();
        this.write();
    }

    write() {
        try {
            fs.writeFileSync(this.filename, this.parseObject());
        } catch(err) {
            console.log(`Error writing to file ${err}`);
        }
    }
}