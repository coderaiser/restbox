'use strict';

const test = require('supertape');
const stub = require('@cloudcmd/stub');

const mockRequire = require('mock-require');
const {reRequire} = mockRequire;

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);

const pathPut = './move';
const pathRestbox = '../restbox';

test('restbox: move: no token', async (t) => {
    const {body} = await request.put('/dropbox/mv', {
        body: {
            from: '/',
            to: '/tmp',
            names: ['1.txt'],
        },
    });
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: move', async (t) => {
    const operate = stub()
        .returns(Promise.resolve());
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    const {move} = require('@cloudcmd/dropbox');
    
    const token = 'hello';
    const options = {
        token,
    };
    
    const names = [
        '1.txs',
    ];
    
    const files = {
        from: '/',
        to: '/tmp',
        names,
    };
    
    await request.put('/dropbox/mv', {
        body: files,
        options,
    });
    
    t.ok(operate.calledWith(move, token, '/', '/tmp', names), 'should call mkdir with token');
    t.end();
});

test('restbox: move: response', async (t) => {
    const operate = stub()
        .returns(Promise.resolve());
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
    };
    
    const names = [
        '1.txt',
    ];
    
    const files = {
        from: '/',
        to: '/tmp',
        names,
    };
    
    const {body} = await request.put('/dropbox/mv', {
        body: files,
        options,
    });
    
    t.equal(body, 'move: ok("1.txt")', 'should equal');
    t.end();
});

