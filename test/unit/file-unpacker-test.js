'use strict'

require('../setup/node')

describe('File unpacker test:', function () {
  var unpacker = require('../../dist/unpacker').default

  it('instance is created', function () {
    expect(unpacker).to.not.be.undefined
  })

  it('public methods are reacheble', function () {
    expect(unpacker.configure).to.not.be.undefined
    expect(unpacker.extractFromFile).to.not.be.undefined
    expect(unpacker.extractFromURL).to.not.be.undefined
  })

  it('options are empty', function () {
    unpacker.configure()
    expect(unpacker._options).to.be.empty
  })

  it('file not exist', function (done) {
    unpacker.extractFromFile('/non-existant.file', '/tmp')
      .catch(function () {
        done()
      })
  })

  it('tarball is decompressed', function (done) {
    unpacker
      .extractFromFile(__dirname + '/../resources/bluebird.tgz', '/tmp/bluebird')
      .then(done)
  })

  it('decompressed files are present', function (done) {
    var files = []

    unpacker.configure({
      onExtract: function (entry) {
        files.push(entry.path)
      }
    })

    unpacker
      .extractFromFile(__dirname + '/../resources/bluebird.tgz', '/tmp/bluebird')
      .then(function () {
        expect(files[0]).to.be.equal('package/package.json')
        expect(files[1]).to.be.equal('package/README.md')
        expect(files[4]).to.be.equal('package/js/browser/bluebird.js')
        done()
      })
  })
})
