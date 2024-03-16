'use strict';

const {test, stub} = require('supertape');
const tryToCatch = require('try-to-catch');

const operate = require('./operate');

const reject = Promise.reject.bind(Promise);

test('restbox: operate', async (t) => {
    const copy = stub().returns(reject(Error('error')));
    
    const [e] = await tryToCatch(operate, copy, 'token', 'dir', ['1.txt']);
    
    t.equal(e.message, 'error');
    t.end();
});
