'use strict';

const test = require('supertape');
const stub = require('@cloudcmd/stub');

const mockRequire = require('mock-require');
const {reRequire} = mockRequire;

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);

const pathDelete = './delete';
const pathRestbox = '../restbox';

const resolve = async () => {};

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
    
    const token = 'hello'
    const options = {
        token,
    };
    
    await request.delete('/dropbox/fs/', {
        options,
    });
    
    t.ok(remove.calledWith(token, '/'), 'should call remove with token');
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
    
    const token = 'hello'
    const options = {
        token,
        root: '/tmp',
    };
    
    await request.delete('/dropbox/fs/', {
        options,
    });
    
    t.ok(remove.calledWith(token, '/tmp/'), 'should call remove with token');
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
    
    const token = 'hello'
    const options = {
        token,
    };
    
    const {body} = await request.delete('/dropbox/fs/', {
        options,
    });
    
    t.equal(body, 'delete: ok("/")', 'should equal');
    t.end();
});

test('restbox: delete: dropbox.remove: files', async (t) => {
    const operate = stub(resolve);
    
    mockRequire('./common/operate', operate);
    
    reRequire(pathDelete);
    
    const restbox = reRequire(pathRestbox);
    const {remove} = require('@cloudcmd/dropbox');
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello'
    const options = {
        token,
        prefix: ''
    };
    
    const files = [
        '1.txt',
        '2.txt',
    ];
    
    await request.delete('/fs/?files', {
        options,
        body: files,
    });
    
    t.ok(operate.calledWith(remove, token, '/', files), 'should call remove with token');
    t.end();
});

