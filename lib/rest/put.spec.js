'use strict';

const {once} = require('events');

const stub = require('@cloudcmd/stub');
const test = require('supertape');
const through2 = require('through2');
const wait = require('@iocmd/wait');

const mockRequire = require('mock-require');
const {reRequire} = mockRequire;

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);

const pathPut = './put';
const pathRestbox = '../restbox';

test('restbox: put: no token', async (t) => {
    const {body} = await request.put('/dropbox/fs/temp');
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: put: mkdir', async (t) => {
    const mkdir = stub()
        .returns(Promise.resolve());
    
    mockRequire('@cloudcmd/dropbox', {
        mkdir,
    });
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
    };
    
    await request.put('/dropbox/fs/hello?dir', {
        options,
    });
    
    t.ok(mkdir.calledWith(token, '/hello'), 'should call mkdir with token');
    t.end();
});

test('restbox: put: response', async (t) => {
    const stream = through2((chunk, enc, fn) => fn(null, chunk));
    const createWriteStream = stub().returns(stream);
    
    mockRequire('@cloudcmd/dropbox', {
        createWriteStream,
    });
    
    reRequire(pathPut);
    
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    const token = 'hello';
    
    const options = {
        token,
    };
    
    const emit = stream.emit.bind(stream);
    const emitMetadataOnceFinish = async () => {
        await once(stream, 'finish');
        await wait(emit, 'metadata');
    };
    
    const [{body}] = await Promise.all([
        request.put('/dropbox/fs/hi.txt', {
            body: 'hello',
            options,
        }),
        wait(emitMetadataOnceFinish),
    ]);
    
    t.equal(body, 'save: ok("/hi.txt")', 'should equal');
    t.end();
});

test('restbox: put: createWriteStream', async (t) => {
    const stream = through2((chunk, enc, fn) => fn(null, chunk));
    const createWriteStream = stub().returns(stream);
    
    mockRequire('@cloudcmd/dropbox', {
        createWriteStream,
    });
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    const token = 'hello';
    const options = {
        token,
    };
    
    const emit = stream.emit.bind(stream);
    const emitMetadataOnceFinish = async () => {
        await once(stream, 'finish');
        await wait(emit, 'metadata');
    };
    
    const [{body}] = await Promise.all([
        request.put('/dropbox/fs/hi.txt', {
            body: 'hello',
            options,
        }),
        wait(emitMetadataOnceFinish),
    ]);
    
    t.ok(createWriteStream.calledWith(token, '/hi.txt'), 'should call createWriteStream');
    t.end();
});

test('restbox: put: unzip', async (t) => {
    const stream = through2((chunk, enc, fn) => fn(null, chunk));
    const createWriteStream = stub()
        .returns(stream);
    
    mockRequire('@cloudcmd/dropbox', {
        createWriteStream,
    });
    
    reRequire(pathPut);
    const restbox = reRequire(pathRestbox);
    
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
    };
    
    const {body} = await request.put('/dropbox/fs/hi.txt?unzip', {
        body: 'hello',
        options,
    });
    
    t.equal(body, 'incorrect header check', 'should equal');
    t.end();
});

