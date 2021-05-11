const util = require('./util');

const timer = new util.Timer();

console.log('creating files...');

util.createRandom(15, 20, 'small');

timer.print();
