'use strict';

const mockRequire = require('mock-require');

const {test, stub} = require('supertape');

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);
const {stopAll, reRequire} = mockRequire;
const pathDelete = './delete';
const pathRestbox = '../restbox';

const resolve = stub().resolves();

test('restbox: delete: no token', async (t) => {
    const {body} = await request.delete('/dropbox/fs/temp');
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: delete: dropbox.remove', async (t) => {
    const remove = stub(resolve);
    
    mockRequire('@cloudcmd/dropbox', {
        remove,
    });
    
    reRequire(pathDelete);
    const restbox = reRequire(pathRestbox);
    
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
    };
    
    await request.delete('/dropbox/fs/', {
        options,
    });
    stopAll();
    
    t.calledWith(remove, [token, '/'], 'should call remove with token');
    t.end();
});

test('restbox: delete: root: dropbox.remove', async (t) => {
    const remove = stub(resolve);
    
    mockRequire('@cloudcmd/dropbox', {
        remove,
    });
    
    reRequire(pathDelete);
    const restbox = reRequire(pathRestbox);
    
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
        root: '/tmp',
    };
    
    await request.delete('/dropbox/fs/', {
        options,
    });
    stopAll();
    
    t.calledWith(remove, [token, '/tmp/'], 'should call remove with token');
    t.end();
});

test('restbox: delete', async (t) => {
    const remove = stub(resolve);
    
    mockRequire('@cloudcmd/dropbox', {
        remove,
    });
    
    reRequire(pathDelete);
    const restbox = reRequire(pathRestbox);
    
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
    };
    
    const {body} = await request.delete('/dropbox/fs/', {
        options,
    });
    
    stopAll();
    
    t.equal(body, 'delete: ok("/")');
    t.end();
});

test('restbox: delete: dropbox.remove: files', async (t) => {
    const operate = stub(resolve);
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathDelete);
    
    const restbox = reRequire(pathRestbox);
    const {remove} = require('@cloudcmd/dropbox');
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
        prefix: '',
    };
    
    const files = [
        '1.txt',
        '2.txt',
    ];
    
    await request.delete('/fs/?files', {
        options,
        body: files,
    });
    stopAll();
    
    t.calledWith(operate, [
        remove,
        token,
        '/',
        files,
    ], 'should call remove with token');
    t.end();
});
