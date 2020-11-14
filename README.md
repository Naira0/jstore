# jstore
A blazing fast formatted text storage library.

## Install
`npm install @naira0/jstore` 

sadly jstore was taken so i had to add my username to it.

### Disclaimer: this is not a database and should not be used as one however you can use it as one if you wish. 

## Usage & format

#### Usage:
```javascript
const Jstore = require('@naira0/jstore');
const jstore = new Jstore('data');

jstore.set('settings', 'fullscreen', true);
const fullscreen = jstore.get('settings', 'fullscreen');
console.log(fullscreen); // Output: True
```

#### jstore file format
```
[header]
key = value
array = [...]

[cooler header]
key 2 = value 2
bool = true
```

## Benchmarks
Speed is very important in a project like this even tho it should not be used as a database it still matters.
you can run all the benchmarks yourself in the test folder / tests.js

### all tests done on node version 14.
```javascript
jstore.set() // average 3ms

jstore.get() // average 0.5ms

jstore.headers // average 2ms

jstore.incr() // average 3ms
```

the following tests were done on a jstore file with 50k lines.
```javascript
jstore.set() // average 130ms

jstore.get() // average 9ms

jstore.headers // average 100ms

jstore.incr() // average 135
```
