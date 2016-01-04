/* global global, beforeEach, afterEach */

export default function () {
  'use strict'

  global.expect = global.chai.expect

  beforeEach(function () {
    this.sandbox = global.sinon.sandbox.create()
    global.stub = this.sandbox.stub.bind(this.sandbox)
    global.spy = this.sandbox.spy.bind(this.sandbox)
  })

  afterEach(function () {
    delete global.stub
    delete global.spy
    this.sandbox.restore()
  })
}
