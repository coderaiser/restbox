'use strict';

const calledWithDiff = require('sinon-called-with-diff');
const sinon = calledWithDiff(require('sinon'));
const test = require('tape');
const fullstore = require('fullstore');

const stringToStream = require('string-to-stream');
const mockRequire = require('mock-require');
const {reRequire} = mockRequire;

const restbox = require('../restbox');
const {request} = require('serve-once')(restbox);

const pathGet = './get';
const pathRestbox = '../restbox';

test('restbox: get: no token', async (t) => {
    const {body} = await request.get('/dropbox/fs/');
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: get: readbox', async (t) => {
    const readbox = sinon
        .stub()
        .returns(stringToStream('hello'));
    
    mockRequire('readbox', readbox);
    
    reRequire(pathGet);
    
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello'
    const root = '/';
    const options = {
        token,
        root,
    };
    
    await request.get('/dropbox/fs/', {
        options,
    });
    
    t.ok(readbox.calledWith(token, '/', {order: 'asc', sort: undefined, root}), 'should call readbox');
    t.end();
});

test('restbox: get: readbox: directory', async (t) => {
    const readbox = sinon
        .stub()
        .returns({
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
    })
    
    reRequire(pathGet);
    
    const restbox = reRequire(pathRestbox);
    const {request} = reRequire('serve-once')(restbox);
    
    const token = 'hello'
    const options = {
        token,
    };
    
    await request.get('/dropbox/fs/hi', {
        options,
    });
    
    t.equal(nameStore(), '/hidirectory.json', 'should equal');
    t.end();
});

test('restbox: get: path beyond root', async (t) => {
    const token = 'hello'
    const options = {
        token,
        root: '/App',
    };
    
    const {body} = await request.get('/dropbox/fs/../../Photos', {
        options,
    });
    
    t.equal(body, 'Path /Photos beyond root /App!', 'should equal');
    t.end();
});

test('restbox: get: path beyond root: function', async (t) => {
    const token = 'hello'
    const options = {
        token,
        root: () => '/App',
    };
    
    const {body} = await request.get('/dropbox/fs/../../Photos', {
        options,
    });
    
    t.equal(body, 'Path /Photos beyond root /App!', 'should equal');
    t.end();
});

test('restbox: get: readbox: size', async (t) => {
    const {body} = await request.get('/dropbox/fs/?size');
    
    t.equal(body, '0b', 'should equal');
    t.end();
});

test('restbox: get: readbox: hash', async (t) => {
    const {random} = Math;
    
    Math.random = sinon
        .stub()
        .returns(31337);
    
    const res = await request.get('/dropbox/fs/?hash');
    const {body} = res;
    
    Math.random = random;
    
    t.equal(body, '31337', 'should equal');
    t.end();
});

