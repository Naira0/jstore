const ms = require('ms');
const util = require('./util');


const Jstore = require('../src/jstore');
const jstore = new Jstore('data');

const start = process.hrtime();
jstore.set('stuff', 'key', 'value');
const end = process.hrtime(start);

console.log(`Memeory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`);
console.log(`Time: ${ms((end[0]* 1000000000 + end[1]) / 1000000, {long: true})}`);


