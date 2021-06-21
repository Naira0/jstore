# jstore
A blazing fast formatted text storage library.

## Install
`npm install @naira0/jstore` 

sadly jstore was taken so i had to add my username to it.

## Usage & format

[Documentation](https://github.com/Naira0terminator/jstore/wiki)

#### Usage:
```javascript
const { Jstore } = require('@naira0/jstore');
const jstore = new Jstore('data');

jstore.set('settings', 'fullscreen', true);
const fullscreen = jstore.get('settings', 'fullscreen');

console.log(fullscreen); // Output: True
```

#### jstore file output
```
[settings]
fullscreen = true
```
