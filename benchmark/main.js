const { Jstore } = require('../lib/jstore');
const { Timer } = require('./util');
const data = new Jstore('small');

const timer = new Timer();

// write benchmarks here

timer.print();