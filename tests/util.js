const { list } = require('./words.json');
const { appendFileSync } = require('fs');
const Jstore = require('../src/jstore');
const jstore = new Jstore('test');

function getRandom() {
    return list[Math.floor(Math.random() * list.length)];
}

function randomNumber(num) {
    return Math.floor(Math.random() * num)
} 

function createWord() {
    let partOne = getRandom().slice(randomNumber(4));
    let partTwo = getRandom().slice(randomNumber(2));

    return partOne + partTwo;
}

// creates a jstore file of a specified size.
exports.createRandom = (headers, entriesPerHeader, filename = `${createWord()}.jstore`) => {
    if(!filename.endsWith('.jstore'))
        filename = `${filename}.jstore`;

    for(let i = 0; i !== headers; i++) {
        appendFileSync(filename, `[${createWord()}]\n`);

        for(let e = 0; e !== entriesPerHeader; e++) {
            appendFileSync(filename, `${createWord()} = ${createWord()}\n`);

            if(e === entriesPerHeader - 1)
                appendFileSync(filename, '\n');
        }
    }
}

// uses the jstore class to write a jstore file of a specified size.
exports.writeTest = (headers, entriesPerHeader) => {

    for(let i = 0; i !== headers; i++) {
        const header = jstore.createHeader(createWord());

        for(let e = 0; e !== entriesPerHeader; e++) 
            header.set(createWord(), createWord());
    }
}