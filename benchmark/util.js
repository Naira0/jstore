const words = require('./words.json').list;
const Jstore = require('../lib/jstore').default;
const fs = require('fs');
const { join } = require('path');
const ms = require('ms');

function getRandom() {
    return words[Math.floor(Math.random() * words.length)];
}

function randomNumber(num) {
    return Math.floor(Math.random() * num)
} 

const createWord = () => {
    let partOne = getRandom().slice(randomNumber(4));
    let partTwo = getRandom().slice(randomNumber(2));

    return partOne + partTwo;
}

exports.createRandom = (headers, keysPerHeader, filename) => {
    console.log('creating jstore file...');

    const filePath = join(process.cwd(), filename.endsWith('.jstore') ? filename : filename+'.jstore');
    const jstore = new Jstore(filename);
    

    if(fs.existsSync(filePath)) 
        fs.unlinkSync(filePath);

    const start = process.hrtime();

    for(let i = 0; i !== headers; i++) {
        const header = jstore.createHeader(`header#${i}`);

        for(let j = 0; j !== keysPerHeader; j++) {
            header.set(createWord(), createWord());
        }
    }

    const end = process.hrtime(start);
    console.log(`finished creating jstore file in ${ms((end[0]* 1000000000 + end[1]) / 1000000, {long: true})}`);
}

