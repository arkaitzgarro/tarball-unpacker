# tarball-unpacker

[![Coverage Status](https://coveralls.io/repos/arkaitzgarro/tarball-unpacker/badge.svg?branch=master&service=github)](https://coveralls.io/github/arkaitzgarro/tarball-unpacker?branch=master)
[![Build Status](https://travis-ci.org/arkaitzgarro/tarball-unpacker.svg?branch=master)](https://travis-ci.org/arkaitzgarro/tarball-unpacker)
[![Dependency Status](https://david-dm.org/arkaitzgarro/tarball-unpacker.svg)](https://david-dm.org/arkaitzgarro/tarball-unpacker)
[![devDependency Status](https://david-dm.org/arkaitzgarro/tarball-unpacker/dev-status.svg)](https://david-dm.org/arkaitzgarro/tarball-unpacker#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Tarball unpacker tool for Node.js

### API

* `extractFromFile` extracts a tarball file into a target directory.

```javascript
import unpacker from 'tarball-unpacker'

// Specify a file and target directory
unpacker
  .extractFromFile('/path/to/file.tgz', '/tmp/destination')
  .then((files) => {
    console.log(files) // An array of unpacked paths to files
    console.log('Done!')
  })
```

Listen to each file extracted:

```javascript
import unpacker from 'tarball-unpacker'

unpacker
  .configure({
    onExtract: (entry) => {
      console.log(entry.path)
    }
  })
  .extractFromFile('/path/to/file.tgz', '/tmp/destination')
  .then(() => {
    console.log('Done!')
  })
  .catch((err) => {
    console.log('Something went wrong ', err)
  })
```

* `extractFromURL` extracts a tarball from URL into a target directory.

```javascript
import unpacker from 'tarball-unpacker'

// Specify a URL and target directory
unpacker
  .extractFromURL('http://www.arkaitzgarro.com/tarball.tgz', '/tmp/destination')
  .then((files) => {
    console.log(files) // An array of unpacked paths to files
    console.log('Done!')
  })
  .catch((err) => {
    console.log('Something went wrong ', err)
  })
```

* Create instances of `unpacker` if needed

```javascript
import {Unpacker} from 'tarball-unpacker'

// Create a new instance of Unpacker
const unpacker = new Unpacker()

unpacker
  .extractFromURL('http://www.arkaitzgarro.com/tarball.tgz', '/tmp/destination')
  .then(() => {
    console.log('Done!')
  })
  .catch((err) => {
    console.log('Something went wrong ', err)
  })
```

### Command line

It's also possible to use `unpacker` as a command line utility, you just need to
install it globally with `npm install -g tarball-unpacker`. Here is the help command
output.

```javascript
Usage: unpacker (<source path> | <url>) <destination folder>

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Examples:
  unpacker /tmp/tarball.tgz /tmp/unpacked
  unpacker http://www.arkaitzgarro.com/tarball.tgz /tmp/unpacked
```
