'use strict';

const {createGunzip} = require('zlib');
const {promisify} = require('util');

const pipe = promisify(require('pipe-io'));
const {
    getPathName,
    getQuery,
} = require('ponse');

const {
    createWriteStream,
    mkdir,
} = require('@cloudcmd/dropbox');

const {
    sendOK,
} = require('./common/send');

const format = require('./common/format');

module.exports = async ({token}, req, res) => {
    const {url} = req;
    const name = getPathName(url);
    const query = getQuery(req);
    
    if (query !== 'dir') {
        const streams = [
            req,
            query === 'unzip' && createGunzip(),
            createWriteStream(token, name),
        ].filter(Boolean);
        
        await pipe(streams);
        
        const msg = format(name, 'save');
        return sendOK(msg, req, res);
    }
    
    await mkdir(token, name);
    
    const msg = format(name, 'make dir');
    sendOK(msg, req, res);
};

