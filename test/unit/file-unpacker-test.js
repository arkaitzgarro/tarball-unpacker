/* global describe, it, expect, __dirname */

'use strict'

import unpacker from '../../dist/unpacker'

describe('File unpacker test:', () => {
  it('instance is created', () => {
    expect(unpacker).to.not.be.undefined
  })

  it('public methods are reacheble', () => {
    expect(unpacker.configure).to.not.be.undefined
    expect(unpacker.extractFromFile).to.not.be.undefined
    expect(unpacker.extractFromURL).to.not.be.undefined
  })

  it('options are empty', () => {
    unpacker.configure()
    expect(unpacker._options).to.be.empty
  })

  it('file not exist', (done) => {
    unpacker.extractFromFile('/non-existant.file', '/tmp')
      .catch(() => {
        done()
      })
  })

  it('tarball is decompressed', (done) => {
    unpacker
      .extractFromFile(__dirname + '/../resources/bluebird.tgz', '/tmp/bluebird')
      .then(() => {
        done()
      })
  })

  it('decompressed files are present', (done) => {
    unpacker
      .extractFromFile(__dirname + '/../resources/bluebird.tgz', '/tmp/bluebird')
      .then((files) => {
        expect(files[0]).to.be.equal('package/package.json')
        expect(files[1]).to.be.equal('package/README.md')
        expect(files[4]).to.be.equal('package/js/browser/bluebird.js')
        done()
      })
  })
})
