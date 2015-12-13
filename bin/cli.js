#!/usr/bin/env node

var unpacker = require('../unpacker');
var yargs = require('yargs');


var argv = yargs.usage('Usage: $0 (<source path> | <url>) <destination folder>')
    .demand(2, 2)
    .example('unpacker /tmp/tarball.tgz /tmp/upacked')
    .example('unpacker http://www.arkaitzgarro.com/tarball.tgz /tmp/upacked')
    .showHelpOnFail(false, 'Specify --help for available options')
    .help('help')
    .argv;

var method = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(argv._[0]) ? 'extractFromURL' : 'extractFromFile';

unpacker[method](argv._[0], argv._[1])
    .then(function() {
        console.info('Done!');
    })
    .catch(console.error);
