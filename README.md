# tarball-unpacker

[![Coverage Status](https://coveralls.io/repos/arkaitzgarro/tarball-unpacker/badge.svg?branch=master&service=github)](https://coveralls.io/github/arkaitzgarro/tarball-unpacker?branch=master)
[![Build Status](https://travis-ci.org/arkaitzgarro/tarball-unpacker.svg?branch=master)](https://travis-ci.org/arkaitzgarro/tarball-unpacker)
[![Dependency Status](https://david-dm.org/arkaitzgarro/tarball-unpacker.svg)](https://david-dm.org/arkaitzgarro/tarball-unpacker)

Tarball unpacker tool for Node.js

### API

* `extractFromFile` extracts a tarball file into a target directory.

```javascript
var unpacker = require('tarball-unpacker');

// Specify a file and target directory
unpacker
    .extractFromFile('/path/to/file.tgz', '/tmp/destination')
    .then(function() {
        console.log('Done!');
    });
```

Listen to each file extracted:

```javascript
var unpacker = require('tarball-unpacker');

unpacker.configure({
    onExtract: function(entry) {
        console.log(entry.path);
    }
});

unpacker
    .extractFromFile('/path/to/file.tgz', '/tmp/destination')
    .then(function() {
        console.log('Done!');
    })
    .catch(function(err) {
        console.log('Something went wrong ', err);
    });
```

* `extractFromURL` extracts a tarball from URL into a target directory.

```javascript
var unpacker = require('tarball-unpacker');

// Specify a URL and target directory
unpacker
    .extractFromFile('http://www.arkaitzgarro.com/tarball.tgz', '/tmp/destination')
    .then(function() {
        console.log('Done!');
    })
    .catch(function(err) {
        console.log('Something went wrong ', err);
    });
```

### Command line

It's also possible to use `tarball-unpacker` as a command line utility, you just need to
install it globally with `npm install -g tarball-unpacker`. Here is the help command
output.

```javascript
Usage: tarball-unpacker (<source path> | <url>) <destination folder>

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Examples:
  unpacker /tmp/tarball.tgz /tmp/unpacked
  unpacker http://www.arkaitzgarro.com/tarball.tgz /tmp/unpacked
```