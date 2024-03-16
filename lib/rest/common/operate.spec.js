'use strict';

const {test, stub} = require('supertape');
const tryToCatch = require('try-to-catch');

const operate = require('./operate');

test('restbox: operate: error', async (t) => {
    const copy = stub().rejects(Error('error'));
    
    const [e] = await tryToCatch(operate, copy, 'token', 'dir', ['1.txt']);
    
    t.equal(e.message, 'error');
    t.end();
});

test('restbox: operate', async (t) => {
    const copy = stub().resolves();
    
    await operate(copy, 'token', 'dir', ['1.txt']);
    
    t.pass('should pass');
    t.end();
});

test('restbox: operate: move', async (t) => {
    const copy = stub().resolves();
    
    await operate(copy, 'token', '/', '/home', ['1.txt']);
    
    t.pass('should pass');
    t.end();
});
