import {join} from 'node:path';
import Router from 'router';
import currify from 'currify';
import {createDebug} from 'obug';
import _onCopy from './rest/copy.js';
import _onMove from './rest/move.js';
import _onGet from './rest/get.js';
import _onPut from './rest/put.js';
import _onDelete from './rest/delete.js';

const log = createDebug('restbox');

const isFn = (a) => typeof a === 'function';
const onCopy = currify(_onCopy);
const onMove = currify(_onMove);
const onGet = currify(_onGet);
const onPut = currify(_onPut);
const onDelete = currify(_onDelete);

const cut = currify((prefix, req, res, next) => {
    req.url = req.url.replace(prefix, '');
    next();
});

const add = currify((root, req, res, next) => {
    const unescaped = unescape(req.url);
    const url = join(rootify(root), unescaped);
    
    req.url = url;
    
    if (url.indexOf(root))
        return next(Error(`Path ${req.url} beyond root ${root}!`));
    
    next();
});

const rootify = (root) => {
    if (!root)
        return '/';
    
    if (isFn(root))
        return root();
    
    return root;
};

export const restbox = (options = {}, overrides = {}) => {
    const {token, prefix = '/dropbox'} = options;
    
    const router = Router();
    const root = rootify(options.root);
    
    const prefixFS = `${prefix}/fs`;
    const prefixCP = `${prefix}/cp`;
    const prefixMV = `${prefix}/mv`;
    
    router
        .route(RegExp(prefixFS))
        .all(cut(prefixFS))
        .all(add(root))
        .get(onGet({
        token,
        root,
        overrides,
    }))
        .put(onPut({
        token,
        overrides,
    }))
        .delete(onDelete({
        token,
        overrides,
    }))
        .all(onError);
    
    router
        .route(prefixCP)
        .all(cut(prefixCP))
        .put(onCopy({
        token,
        overrides,
    }))
        .all(onError);
    
    router
        .route(prefixMV)
        .all(cut(prefixMV))
        .put(onMove({
        token,
        overrides,
    }))
        .all(onError);
    
    return router;
};
const onError = (e, req, res, next) => {
    log(e);
    res.statusCode = 404;
    res.end(e.message);
};
