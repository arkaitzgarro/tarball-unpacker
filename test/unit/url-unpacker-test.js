/* global describe, beforeEach, it, expect, spy */
/* jshint -W030 */

'use strict';

require('../setup/node');

describe('URL unpacker test:', function() {

    var unpacker = require('../../src/unpacker');

    it('instance is created', function() {
        expect(unpacker).to.not.be.undefined;
    });

    it('public methods are reacheble', function() {
        expect(unpacker.configure).to.not.be.undefined;
        expect(unpacker.extractFromFile).to.not.be.undefined;
        expect(unpacker.extractFromURL).to.not.be.undefined;
    });

    it('options are empty', function() {
        unpacker.configure();
        expect(unpacker._options).to.be.empty;
    });

    it('url doesn not exist', function(done) {
        unpacker.extractFromURL('http://www.google.com/non-existant.file', '/tmp')
            .catch(function() {
                done();
            });
    });

    it('server does not responde', function(done) {
        unpacker.extractFromURL('http://locahost:0/', '/tmp')
            .catch(function() {
                done();
            });
    });

    it('tarball is decompressed', function(done) {
        unpacker.extractFromURL('http://registry.npmjs.org/bluebird/-/bluebird-3.0.6.tgz', '/tmp/bluebird')
            .then(done);
    });

    it('decompressed files are present', function() {
        var files = [];

        unpacker.configure({
            onExtract: function(entry) {
                files.push(entry.path);
            }
        });

        unpacker
            .extractFromURL('http://registry.npmjs.org/bluebird/-/bluebird-3.0.6.tgz', '/tmp/bluebird')
            .then(function() {
                expect(files[0]).to.be.equal('package/package.json');
                expect(files[1]).to.be.equal('package/README.md');
                expect(files[4]).to.be.equal('package/js/browser/bluebird.js');
                done();
            });
    });

});
