'use strict';

const mockRequire = require('mock-require');

const {test, stub} = require('supertape');

const fullstore = require('fullstore');

const stringToStream = require('string-to-stream');

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);
const {stopAll, reRequire} = mockRequire;
const pathGet = './get';
const pathRestbox = '../restbox';

test('restbox: get: no token', async (t) => {
    const {body} = await request.get('/dropbox/fs/');
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: get: readbox', async (t) => {
    const readbox = stub().returns(stringToStream('hello'));
    
    mockRequire('readbox', readbox);
    
    reRequire(pathGet);
    
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const root = '/';
    
    const options = {
        token,
        root,
    };
    
    await request.get('/dropbox/fs/', {
        options,
    });
    stopAll();
    
    const args = [token, '/', {
        order: 'asc',
        sort: undefined,
        root,
    }];
    
    t.calledWith(readbox, args, 'should call readbox');
    t.end();
});

test('restbox: get: readbox: directory', async (t) => {
    const readbox = stub().returns({
        ...stringToStream('hello'),
        type: 'directory',
    });
    
    const nameStore = fullstore();
    const setHeader = ({name}) => nameStore(name);
    
    mockRequire('readbox', readbox);
    const {getQuery, getPathName} = require('ponse');
    
    mockRequire('ponse', {
        getQuery,
        getPathName,
        setHeader,
    });
    
    reRequire(pathGet);
    
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello';
    const options = {
        token,
    };
    
    await request.get('/dropbox/fs/hi', {
        options,
    });
    stopAll();
    
    t.equal(nameStore(), '/hidirectory.json');
    t.end();
});

test('restbox: get: path beyond root', async (t) => {
    const token = 'hello';
    const options = {
        token,
        root: '/App',
    };
    
    const {body} = await request.get('/dropbox/fs%2f%2e%2e%2f%2e%2e%2fPhotos', {
        options,
    });
    
    t.equal(body, 'Path /Photos beyond root /App!');
    t.end();
});

test('restbox: get: path beyond root: function', async (t) => {
    const token = 'hello';
    const options = {
        token,
        root: () => '/App',
    };
    
    const {body} = await request.get('/dropbox/fs%2f%2e%2e%2f%2e%2e%2fPhotos', {
        options,
    });
    
    t.equal(body, 'Path /Photos beyond root /App!');
    t.end();
});

test('restbox: get: readbox: size', async (t) => {
    const {body} = await request.get('/dropbox/fs/?size');
    
    t.equal(body, '0b');
    t.end();
});

test('restbox: get: readbox: hash', async (t) => {
    const {random} = Math;
    
    Math.random = stub().returns(31_337);
    
    const {body} = await request.get('/dropbox/fs/?hash');
    
    Math.random = random;
    
    t.equal(body, '31337');
    t.end();
});
