#!/usr/bin/env node

'use strict'

import unpacker from './unpacker'
import yargs from 'yargs'

const argv = yargs.usage('Usage: $0 (<source path> | <url>) <destination folder>')
  .demand(2, 2)
  .example('unpacker /tmp/tarball.tgz /tmp/unpacked')
  .example('unpacker http://www.arkaitzgarro.com/tarball.tgz /tmp/unpacked')
  .showHelpOnFail(false, 'Specify --help for available options')
  .version(() => {
    return require('../package').version
  })
  .help('help')
  .argv

const isURL = /[a-z]{2,6}?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
const method = isURL.test(argv._[0]) ? 'extractFromURL' : 'extractFromFile'

unpacker[method](argv._[0], argv._[1])
  .then(() => {
    console.info('Done!')
  })
  .catch(console.error)
