'use strict'

import Promise from 'bluebird'
import http from 'http'
import fs from 'fs'
import tar from 'tar'
import zlib from 'zlib'

class Unpacker {

  /**
   * Unpacker contructor
   */
  constructor () {
    this._options = {}
  }

  /**
   * Configure unpacker with decompression options
   *
   * @param  {Object} options Options for decompression
   * @return {Object}         Self instance
   */
  configure (options) {
    // TODO: extend default instance properties
    this._options = options || {}

    return this
  }

  /**
   * Given a path to a tarball, extract the content on destination folder
   *
   * @param  {String} tarballPath       Relative/absolute path to tarball file
   * @return {String} destinationFolder Final destination folder
   */
  extractFromFile (tarballPath, destinationFolder) {
    const _extractFromFile = function _extractFromFile (resolve, reject) {
      const file = fs.createReadStream(tarballPath)

      file.on('error', function () {
        reject(new Error('File not found: ' + tarballPath))
      })

      this._extract(file, destinationFolder).then(resolve).catch(reject)
    }

    const promise = new Promise(_extractFromFile.bind(this))

    return promise
  }

  /**
   * Given a URL to a tarball, extract the content on destination folder
   *
   * @param  {String}  url URL to tarball file
   * @return {Promise}
   */
  extractFromURL (url, destinationFolder) {
    const _extractFromURL = function _extractFromURL (resolve, reject) {
      console.info('Conecting to: ' + url)

      const req = http.get(url, function (response) {
        if (response.statusCode !== 200) {
          reject(new Error('Response not OK: ' + response.statusCode))
          return
        }

        console.info('Downloading file...')

        this._extract(response, destinationFolder)
          .then(resolve)
          .catch(reject)
      }.bind(this))

      req.on('error', function (e) {
        reject(new Error('Problem with http request: ' + e.message))
      })
    }

    return new Promise(_extractFromURL.bind(this))
  }

  _extract (stream, destinationFolder) {
    const extract = function (resolve, reject) {
      const files = []

      console.info('Extracting file into ' + destinationFolder)

      stream
        .pipe(zlib.createGunzip())
        .pipe(tar.Extract({path: destinationFolder}))
        .on('entry', function (entry) {
          files.push(entry.path)

          if (this._options.onExtract) {
            this._options.onExtract(entry)
          }
        }.bind(this))
        .on('error', reject)
        .on('end', () => {
          resolve(files)
        })
    }

    return new Promise(extract.bind(this))
  }
}

export default new Unpacker()
export {Unpacker}
