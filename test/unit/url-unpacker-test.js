/* global describe, it, expect */

'use strict'

import unpacker from '../../dist/unpacker'

describe('URL unpacker test:', () => {
  const tarballURL = 'http://registry.npmjs.org/tarball-unpacker/-/tarball-unpacker-1.0.2.tgz'

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

  it('url doesn not exist', (done) => {
    unpacker.extractFromURL('http://www.google.com/non-existant.file', '/tmp')
      .catch(() => {
        done()
      })
  })

  it('server does not responde', (done) => {
    unpacker.extractFromURL('http://locahost:0/', '/tmp')
      .catch(() => {
        done()
      })
  })

  it('tarball is decompressed', (done) => {
    unpacker.extractFromURL(tarballURL, '/tmp/tarball-unpacker')
      .then(() => {
        done()
      })
  })

  it('decompressed files are present', (done) => {
    unpacker
      .extractFromURL(tarballURL, '/tmp/tarball-unpacker')
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
      .extractFromURL(tarballURL, '/tmp/tarball-unpacker')
      .then(() => {
        expect(files[0]).to.be.equal('package/package.json')
        expect(files[1]).to.be.equal('package/README.md')
        expect(files[3]).to.be.equal('package/dist/cli.js')
        expect(files[4]).to.be.equal('package/dist/unpacker.js')
        done()
      })
  })
})
