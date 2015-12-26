'use strict';

var Promise = require('bluebird');
var http = require('http');
var fs = require('fs');
var tar = require('tar');
var zlib = require('zlib');

/**
 * Unpacker contructor
 * @return {Object} Instance of Unpacker
 */
var Unpacker = function Unpacker() {
    this._options = {};
};

/**
 * Configure unpacker with decompression options
 * @param  {Object} options Options for decompression
 * @return {Object}         Self instance
 */
Unpacker.prototype.configure = function(options) {
    // TODO: extend default instance properties
    this._options = options || {};

    return this;
};

var extract = function(stream, destinationFolder) {
    var _extract = function(resolve, reject) {

        console.info('Extracting file into ' + destinationFolder);

        stream
            .pipe(zlib.createGunzip())
            .pipe(tar.Extract({path: destinationFolder}))
            .on('entry', function(entry) {
                if (this._options.onExtract) {
                    this._options.onExtract(entry);
                }
            }.bind(this))
            .on('error', reject)
            .on('end', resolve);
    };

    return new Promise(_extract.bind(this));
};

/**
 * Given a path to a tarball, extract the content on destination folder
 * @param  {String} tarballPath       Relative/absolute path to tarball file
 * @return {String} destinationFolder Final destination folder
 */
Unpacker.prototype.extractFromFile = function(tarballPath, destinationFolder) {
    var _extractFromFile = function _extractFromFile(resolve, reject) {
        var file = fs.createReadStream(tarballPath);

        file.on('error', function() {
            reject(new Error('File not found: ' + tarballPath));
        });

        extract.call(this, file, destinationFolder).then(resolve).catch(reject);
    };

    return new Promise(_extractFromFile.bind(this));
};

/**
 * Given a URL to a tarball, extract the content on destination folder
 * @param  {[type]} first_argument [description]
 * @return {[type]}                [description]
 */
Unpacker.prototype.extractFromURL = function(url, destinationFolder) {
    var _extractFromURL = function _extractFromURL(resolve, reject) {

        console.info('Conecting to: ' + url);

        var req = http.get(url, function(response) {
            if (response.statusCode !== 200) {
                reject(new Error('Response not OK: ' + response.statusCode));
                return;
            }

            console.info('Downloading file...');

            extract.call(this, response, destinationFolder)
                .then(resolve)
                .catch(reject);
        }.bind(this));

        req.on('error', function(e) {
            reject(new Error('Problem with http request: ' + e.message));
        });
    };

    return new Promise(_extractFromURL.bind(this));
};

module.exports = new Unpacker();
