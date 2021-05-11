const words = require('./words.json').list;
const { Jstore } = require('../lib/jstore');
const fs = require('fs');
const { join } = require('path');
const ms = require('ms');

exports.createRandom = (headers, keysPerHeader, filename) => {

    const filePath = join(process.cwd(), filename.endsWith('.jstore') ? filename : filename+'.jstore');
    
    if(fs.existsSync(filePath)) 
        fs.unlinkSync(filePath);
        
    const jstore = new Jstore(filename);

    for(let i = 0; i !== headers; i++) {
        const header = jstore.createHeader(`header#${i}`);

        for(let j = 0; j !== keysPerHeader; j++) {
            header.set(createWord(), dataType());
        }
    }
}

exports.Timer = class Timer {
    constructor() {
        this.start = process.hrtime()
    }

    // returns time since start as ms
    elapsed() {
        const end = process.hrtime(this.start);
        return (end[0]* 1000000000 + end[1]) / 1000000
    }

    // prints elapsed time
    print() {
        console.log(`Time: ${ms(this.elapsed(), {long: true})}`)
    }
    
}

function getRandom() {
    return words[Math.floor(Math.random() * words.length)];
}

function random(num) {
    return Math.floor(Math.random() * num)
} 

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const createWord = () => {
    let partOne = getRandom().slice(random(4));
    let partTwo = getRandom().slice(random(2));

    return partOne + partTwo;
}

function makeArray() {
    let arr = [];
    const n = randRange(50, 350);
    
    for(let i = 0; i !== n; i++) 
        arr.push(createWord());
    
    return arr;
}

function makeBool() {
    return randRange(1, 2) === 1 ? true : false;
}

function makeNumber() {
    const chance = randRange(1, 2)
    return chance === 1 ? random(9999) : Math.random() * 9999;
}

function makeString() {
    return createWord();
}

function dataType() {
    const chance = randRange(1, 4);

    switch(chance) {
        case 1:
            return makeArray();
        case 2:
            return makeBool();
        case 3: 
            return makeNumber();
        case 4:
            return makeString();
    }
}



