'use strict';

const {createGunzip} = require('zlib');
const {promisify} = require('util');

const tryToCatch = require('try-to-catch');
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
        await putFile(token, {
            name,
            req,
            query,
        });
        
        const msg = format(name, 'save');
        return sendOK(msg, req, res);
    }
    
    await mkdir(token, name);
    
    const msg = format(name, 'make dir');
    sendOK(msg, req, res);
};

async function putFile(token, {name, query, req}) {
    const writeStream = createWriteStream(token, name);
    
    const streams = [
        req,
        query === 'unzip' && createGunzip(),
        writeStream,
    ].filter(Boolean);
    
    await pipe(streams);
    await confirmEndWriting(writeStream);
}

async function confirmEndWriting(writeStream) {
    const on = promisify(writeStream.on.bind(writeStream));
    await tryToCatch(on, 'metadata');
}

