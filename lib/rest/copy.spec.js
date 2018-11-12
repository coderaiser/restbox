'use strict';

const calledWithDiff = require('sinon-called-with-diff');
const sinon = calledWithDiff(require('sinon'));
const test = require('tape');

const mockRequire = require('mock-require');
const {reRequire} = mockRequire;

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);

const pathPut = './copy';
const pathRestbox = '../restbox';

test('restbox: copy: no token', async (t) => {
    const {body} = await request.put('/dropbox/cp', {
        body: {
            from: '/',
            to: '/tmp',
            names: ['1.txt'],
        }
    });
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: copy', async (t) => {
    const operate = sinon
        .stub()
        .returns(Promise.resolve());
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    const {copy} = require('@cloudcmd/dropbox');
    
    const token = 'hello'
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
    
    await request.put('/dropbox/cp', {
        body: files,
        options,
    });
    
    t.ok(operate.calledWith(copy, token, '/', '/tmp', names), 'should call mkdir with token');
    t.end();
});

test('restbox: copy: response', async (t) => {
    const operate = sinon
        .stub()
        .returns(Promise.resolve());
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello'
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
    
    const {body} = await request.put('/dropbox/cp', {
        body: files,
        options,
    });
    
    t.equal(body, 'copy: ok("1.txt")', 'should equal');
    t.end();
});
