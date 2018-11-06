'use strict';

const {Router} = require('express');
const currify = require('currify');
const log = require('debug')('restbox');

const onCopy = require('./rest/copy');
const onMove = require('./rest/move');
const onGet = require('./rest/get');
const onPut = require('./rest/put');
const onDelete = require('./rest/delete');

const cut = currify((prefix, req, res, next) => {
    req.url = req.url.replace(prefix, '');
    next();
});

module.exports = (options = {}) => {
    const {
        token,
        prefix = '/dropbox',
    } = options;
    
    const router = Router();
    
    const prefixFS = `${prefix}/fs`;
    const prefixCP = `${prefix}/cp`;
    const prefixMV = `${prefix}/mv`;
    
    router.route(`${prefixFS}/*`)
        .all(cut(prefixFS))
        .get(ewrap(onGet, {token}))
        .put(ewrap(onPut, {token}))
        .delete(ewrap(onDelete, {token}));
    
    router.route(prefixCP)
        .all(cut(prefixCP))
        .put(ewrap(onCopy, {token}))
    
    router.route(prefixMV)
        .all(cut(prefixMV))
        .put(ewrap(onMove, {token}))
    
    return router;
};

const ewrap = currify((promise, options, req, res) => {
    promise(options, req, res)
        .catch(sendError(res));
});

const sendError = currify((res, e) => {
    log(e);
    res.statusCode = 404;
    res.end(e.message);
});

