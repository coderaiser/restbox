'use strict';

const test = require('supertape');
const restbox = require('./restbox');
const {request} = require('serve-once')(restbox);

test('restbox: no options', async (t) => {
    const {body} = await request.get('/dropbox/fs');
    
    t.equal(body, 'token should be a string!');
    t.end();
});

test('restbox: no options: returns function', (t) => {
    t.equal(typeof restbox(), 'function');
    t.end();
});

test('restbox: options', async (t) => {
    const options = {
        prefix: '/xxx',
    };
    
    const {body} = await request.get('/xxx/fs', {
        options,
    });
    
    t.equal(body, 'token should be a string!');
    t.end();
});
