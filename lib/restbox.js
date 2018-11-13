'use strict';

const {join} = require('path');
const Router = require('router');
const currify = require('currify');
const log = require('debug')('restbox');

const onCopy = currify(require('./rest/copy'));
const onMove = currify(require('./rest/move'));
const onGet = currify(require('./rest/get'));
const onPut = currify(require('./rest/put'));
const onDelete = currify(require('./rest/delete'));

const cut = currify((prefix, req, res, next) => {
    req.url = req.url.replace(prefix, '');
    next();
});

const add = currify((root, req, res, next) => {
    req.url = join(rootify(root), req.url);
    
    if (req.url.indexOf(root))
        return next(Error(`Path ${req.url} beyond root ${root}!`));
     
    next();
});

const rootify = (root) => {
    if (!root)
        return '/';
    
    if (typeof root === 'function')
        return root();
    
    return root;
};

module.exports = (options = {}) => {
    const {
        token,
        prefix = '/dropbox',
    } = options;
    
    const router = Router();
    const root = rootify(options.root);
    
    const prefixFS = `${prefix}/fs`;
    const prefixCP = `${prefix}/cp`;
    const prefixMV = `${prefix}/mv`;
    
    router.route(`${prefixFS}/*`)
        .all(cut(prefixFS))
        .all(add(root))
        .get(onGet({token, root}))
        .put(onPut({token}))
        .delete(onDelete({token}))
        .all(onError);
    
    router.route(prefixCP)
        .all(cut(prefixCP))
        .put(onCopy({token}))
        .all(onError);
    
    router.route(prefixMV)
        .all(cut(prefixMV))
        .put(onMove({token}))
        .all(onError);
    
    return router;
};

const onError = (e, req, res, next) => {
    log(e);
    res.statusCode = 404;
    res.end(e.message);
};

