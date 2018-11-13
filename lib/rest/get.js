'use strict';

const {parse} = require('querystring');
const readbox = require('readbox');

const {
    getQuery,
    getPathName,
    setHeader,
} = require('ponse');

const {
    sendOK,
} = require('./common/send');

module.exports = async ({token, root}, req, res) => {
    const {url} = req;
    const name = getPathName(url);
    const query = getQuery(req);
    
    if (query === 'hash')
        return sendOK(Math.random(), req, res);
    
    return read({token, root}, name, req, res)
};

async function read({token, root}, name, request, response) {
    const query = getQuery(request);
    
    if (query === 'size')
        return response.send('0b');
    
    const {
        sort,
        order = 'asc',
    } = parse(query);
    
    const stream = await readbox(token, name, {
        sort,
        order,
        root,
    });
    
    const {type} = stream;
    
    if (type === 'directory')
        name += 'directory.json'
    
    setHeader({
        name,
        request,
        response,
    });
    
    stream
        .pipe(response);
}

