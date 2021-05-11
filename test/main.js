const { Jstore } = require('../lib/jstore');
const test = new Jstore('test');

// no need to check if it exists cause it will just return the existing header if it does
const header = test.createHeader('data');
header.set('k', 'value');

// uniformly sets the data with an object
// as well as showing the support for data types
header.set({
    bool: true,
    string: "this is a string",
    int: 5,
    float: 5.56,
    array: ["e1", "e2", "e3", "e4"]
});

// returns the header as an object and prints its keys and values
// usually works very fast much faster then Object.entries()
const entries = header.entries();
for(const key in entries) {
    //console.log(`${key}: ${entries[key]} | Type => ${typeof entries[key]}`);
}


header.delete('k');
header.delete();

// works just like std push and pop except you have to provide a key to perform the operation on
const arrTest = test.set('array test', 'arr', ['e1', 'e2', 'e3']);
arrTest.push('arr', 'e4');
arrTest.pop('arr');

// creates the header if not exist
const i = test.set('int test', 'int', 5);
const f = test.set('int test', 'float', 5.50);

i.incr('int', 30);
f.decr('float', 3.7);

if(test.headerExists('int test')) {
    console.log('Header xists!');
}

if(test.keyExists('int test', 'int')) {
    console.log('Key exists!');
}

const intTest = test.get('int test');

if(intTest.exists('float')) {
    console.log('Float exists!');
}

test.set('find test', {
    yeskey: 'yes',
    nokey: 'no',
    something: 'maybe',
});

test.set('find test #2', {
    mayhapskey: 'sure!',
    nokey: 'yes',
});

test.set('find test #3', 'key', 'value');

// find all keys that match the argument exactly 
const keys = test.findKeys('nokey');
//console.log(keys);

// this only checks if it is included within the name cause there can never be two headers with the same name
const headers = test.findHeaders('find test');
//headers.forEach(header => console.log(header.name));

// also works with regex!!!
const regex = test.findHeaders(/#\d$/g);
//regex.forEach(header => console.log(header.name));

test.headers.forEach(header => console.log(header.name));




