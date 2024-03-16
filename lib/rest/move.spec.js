'use strict';

const mockRequire = require('mock-require');

const {test, stub} = require('supertape');

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);
const {stopAll, reRequire} = mockRequire;
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
    const operate = stub().returns(Promise.resolve());
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    const {move} = require('@cloudcmd/dropbox');
    
    const token = 'hello';
    const options = {
        token,
    };
    
    const names = ['1.txs'];
    
    const body = {
        from: '/',
        to: '/tmp',
        names,
    };
    
    await request.put('/dropbox/mv', {
        body,
        options,
    });
    stopAll();
    
    t.calledWith(operate, [
        move,
        token,
        '/',
        '/tmp',
        names,
    ], 'should call mkdir with token');
    t.end();
});

test('restbox: move: response', async (t) => {
    const operate = stub().returns(Promise.resolve());
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
    };
    
    const names = ['1.txt'];
    
    const files = {
        from: '/',
        to: '/tmp',
        names,
    };
    
    const {body} = await request.put('/dropbox/mv', {
        body: files,
        options,
    });
    
    stopAll();
    
    t.equal(body, 'move: ok("1.txt")');
    t.end();
});
