'use strict';

const restbox = require('./restbox');
const fetch = require('node-fetch');
const {serve} = require('serve-once')(restbox);

const test = require('supertape');

test('restbox: no options', async (t) => {
    const {port, close} = await serve();
    const response = await fetch(`http://localhost:${port}/dropbox/fs/`);
    const result = await response.text();
    
    await close();
    
    t.equal(result, 'token should be a string!', 'should equal');
    t.end();
});

