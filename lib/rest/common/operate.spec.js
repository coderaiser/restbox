'use strict';

const test = require('supertape');
const tryToCatch = require('try-to-catch');
const stub = require('@cloudcmd/stub');

const operate = require('./operate');

const reject = Promise.reject.bind(Promise);

test('restbox: operate', async (t) => {
    const copy = stub()
        .returns(reject(Error('error')));
    
    const [e] = await tryToCatch(operate, copy, 'token', 'dir', [
        '1.txt',
    ]);
    
    t.equal(e.message, 'error', 'should equal');
    t.end();
});
