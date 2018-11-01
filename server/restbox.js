'use strict';

const path = require('path');
const {
    promisify,
} = require('util');
const {createGunzip} = require('zlib');
const {parse} = require('querystring');
const {
    getQuery,
    getPathName,
    send,
    setHeader,
} = require('ponse');

const {Router} = require('express');
const currify = require('currify');
const readbox = require('readbox');
const pullout = promisify(require('pullout'));
const pipe = promisify(require('pipe-io'));
const {
    remove,
    mkdir,
    createWriteStream,
} = require('@cloudcmd/dropbox');

const ewrap = currify((promise, options, req, res) => {
    promise(options, req, res)
        .catch(sendError(res));
});

module.exports = (options = {}) => {
    const {
        token,
        prefix = '/dropbox',
    } = options;
    
    const router = Router();
    
    router.route(`${prefix}/*`)
        .get(ewrap(onGet, {token, prefix}))
        .put(ewrap(onPut, {token, prefix}))
        .delete(ewrap(onDelete, {token, prefix}));
    
    return router;
};

const onGet = async ({token, prefix}, req, res) => {
    const url = req.url.replace(prefix, '');
    const name = getPathName(url);
    const query = getQuery(req);
    
    if (query === 'hash')
        return send(String(Math.random()), {
            request: req,
            response: res,
        });
    
    return read(token, name, {req, res})
};

const onDelete = async ({token, prefix}, req, res) => {
    const url = req.url.replace(prefix, '');
    const dir = getPathName(url);
    
    const body = await pullout(req);
    const files = JSON.parse(body);
    
    for (const file of files) {
        const full = path.join(dir, file);
        await remove(token, full);
    }
    
    const msg = format(dir, 'delete');
    sendOK(dir, msg, req, res);
};

const onPut = async ({token, prefix}, req, res) => {
    const url = req.url.replace(prefix, '');
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
        sendOK(name, msg, req, res);
    }
    
    await mkdir(token, name);
    
    const msg = format(name, 'make dir');
    sendOK(name, msg, req, res);
};

const sendError = currify((res, e) => {
    res.statusCode = 404;
    res.end(e.message);
});

async function read(token, name, {req, res}) {
    const query = getQuery(req);
    
    if (query === 'size')
        return res.send('0b');
    
    const {
        sort,
        order = 'asc',
    } = parse(query);
    
    const stream = await readbox(token, name, {
        sort,
        order,
    });
    
    const {json} = stream;
    
    if (json)
        name += 'dir.json'
    
    setHeader({
        request: req,
        response: res,
        name,
    });
    
    stream
        .pipe(res);
}

const sendOK = (name, msg, req, res) => {
    send(msg, {
        name,
        request: req,
        response: res,
    });
};

function format(name, msg) {
    return `${msg}: ok("${name}")`;
}

