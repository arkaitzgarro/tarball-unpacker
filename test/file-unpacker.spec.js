/* global describe, it, spy, expect, __dirname */

'use strict'

import unpacker from '../src/unpacker'

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

  it('logger is set', () => {
    expect(unpacker._logger).to.not.be.undefined
  })

  it('logger is not called', (done) => {
    const loggerSpy = spy(unpacker, '_logger')

    unpacker.configure({
      silent: true
    })

    unpacker.extractFromFile('/non-existant.file', '/tmp')
      .catch(() => {
        expect(loggerSpy.called).to.be.false
        done()
      })
  })

  it('file not exist', (done) => {
    unpacker.extractFromFile('/non-existant.file', '/tmp')
      .catch(() => {
        done()
      })
  })

  it('tarball is decompressed', (done) => {
    unpacker
      .extractFromFile(__dirname + '/resources/tarball-unpacker.tgz', '/tmp/unpacker')
      .then(() => {
        done()
      })
  })

  it('decompressed files are present', (done) => {
    unpacker
      .extractFromFile(__dirname + '/resources/tarball-unpacker.tgz', '/tmp/unpacker')
      .then((files) => {
        expect(files[0]).to.be.equal('package/package.json')
        expect(files[1]).to.be.equal('package/README.md')
        expect(files[3]).to.be.equal('package/dist/cli.js')
        expect(files[4]).to.be.equal('package/dist/unpacker.js')
        done()
      })
  })

  it('onExtract event is called', (done) => {
    const files = []

    unpacker.configure({
      onExtract: (entry) => {
        files.push(entry.path)
      }
    })

    unpacker
      .extractFromFile(__dirname + '/resources/tarball-unpacker.tgz', '/tmp/unpacker')
      .then(() => {
        expect(files[0]).to.be.equal('package/package.json')
        expect(files[1]).to.be.equal('package/README.md')
        expect(files[3]).to.be.equal('package/dist/cli.js')
        expect(files[4]).to.be.equal('package/dist/unpacker.js')
        done()
      })
  })
})
