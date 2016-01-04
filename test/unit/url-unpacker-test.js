/* global describe, it, expect */

'use strict'

import unpacker from '../../dist/unpacker'
import * as setup from '../setup/node'

describe('URL unpacker test:', () => {
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
    unpacker.extractFromURL('http://registry.npmjs.org/bluebird/-/bluebird-3.0.6.tgz', '/tmp/bluebird')
      .then(done)
  })

  it('decompressed files are present', (done) => {
    const files = []

    unpacker.configure({
      onExtract: (entry) => {
        files.push(entry.path)
      }
    })

    unpacker
      .extractFromURL('http://registry.npmjs.org/bluebird/-/bluebird-3.0.6.tgz', '/tmp/bluebird')
      .then(() => {
        expect(files[0]).to.be.equal('package/package.json')
        expect(files[1]).to.be.equal('package/README.md')
        expect(files[4]).to.be.equal('package/js/browser/bluebird.js')
        done()
      })
  })
})
