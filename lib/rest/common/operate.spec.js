'use strict';

const test = require('tape');
const tryToCatch = require('try-to-catch');
const sinon = require('sinon');

const operate = require('./operate');

const reject = Promise.reject.bind(Promise);

test('restbox: operate', async (t) => {
    const copy = sinon
        .stub()
        .returns(reject(Error('error')));
    
    const [e] = await tryToCatch(operate, copy, 'token', 'dir', [
        '1.txt'
    ]);
    
    t.equal(e.message, 'error', 'should equal');
    t.end();
});
