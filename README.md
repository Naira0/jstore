# jstore
A blazing fast formatted text storage library.

## Install
`npm install @naira0/jstore` 

sadly jstore was taken so i had to add my username to it.

## Usage & format

### Disclaimer: this is not a database and should not be used as one however you can use it as one if you wish. 

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
File size: 500 lines
```javascript
jstore.set() // average 3ms

jstore.get() // average 0.5ms

jstore.headers // average 2ms

jstore.incr() // average 3ms
```

File size: 50k lines
```javascript
jstore.set() // average 130ms

jstore.get() // average 9ms

jstore.headers // average 100ms

jstore.incr() // average 135
```
Obviously speed entirely depends on the number of lines the file has but it is still fairly fast on even a massive file. ofc a file with 50k lines is unrealistic for its use case.

## Guides
The api is fairly easy to learn and use it mimics the api of most key value databases and is fairly well documented whithin the code.

### Basics

#### Headers
Headers are much like tables in databases it helps structure your code.

whenever you do any sort of operation that works on a header it will return a header class which has the same methods except you dont have to write a header in the paramater.
```javascript
// if no key is suplied it will return the header.
const header = jstore.get('myHeader');
header.set('key', 'value);

console.log(header.get('key');
```
#### Uniform set
you can uniformly set data using objects
```javascript
jstore.set('header', {
  key: 'value',
  bool: true,
  number: 42,
  array: ['e0', 'e1, 'e2', 'e3']
  });
```

### Type specific operations
there are certain methods that only work on certain types
```javascript
if the key is an array it will add the value to the end of it otherwise it will do nothing.
jstore.push('header', 'key', 'value);

// if the key is a number it will increament it by 50 you can also use `jstore.decr()` as an opposite.
jstore.incr('header', 'key', 50);
```

#### Iterating over headers.
To iterate over a header you can use `jstore.headers` and it will return an array of header classes.
```javascript
// clears all headers in the given jstore file.
jstore.headers.forEach(header => header.clear());
```

### Types
jstore has support for most javascript types as it uses javascript objects as a form of serialization

this includes:
* strings
* booleans
* arrays
* numbers

even keys can be one of these types except for arrays.

### Jstore file
the jstore file format is very simple and easy to read and edit.
jstore will always sync the contents of the file when setting new data so you can edit it manually.

when you create a new jstore class it will check if the given file name exists and if it doesnt it will create one in the current working directory.
