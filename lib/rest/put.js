import {createGunzip} from 'node:zlib';
import {promisify} from 'node:util';
import {tryToCatch} from 'try-to-catch';
import pipe from 'pipe-io';
import {getPathName, getQuery} from 'ponse';
import {
    createWriteStream as _createWriteStream,
    mkdir as _mkdir,
} from '@cloudcmd/dropbox';
import {sendOK} from './common/send.js';
import format from './common/format.js';

export default async ({
    token,
    overrides = {},
}, req, res) => {
    const {
        createWriteStream = _createWriteStream,
        mkdir = _mkdir,
    } = overrides;
    
    const name = getPathName(req);
    const query = getQuery(req);
    
    if (query !== 'dir') {
        await putFile(token, {
            name,
            req,
            query,
            createWriteStream,
        });
        
        const msg = format(name, 'save');
        
        return sendOK(msg, req, res);
    }
    
    await mkdir(token, name);
    
    const msg = format(name, 'make dir');
    sendOK(msg, req, res);
};

async function putFile(token, {name, query, req, createWriteStream}) {
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
