import {test, stub} from 'supertape';
import {fullstore} from 'fullstore';
import stringToStream from 'string-to-stream';
import {serveOnce} from 'serve-once';
import {restbox} from '../restbox.js';

test('restbox: get: no token', async (t) => {
    const {request} = serveOnce(restbox);
    const {body} = await request.get('/dropbox/fs/');
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: get: readbox', async (t) => {
    const readbox = stub().returns(stringToStream('hello'));
    const {request} = serveOnce((options) => restbox(options, {
        readbox,
    }));
    
    const token = 'hello';
    const root = '/';
    
    const options = {
        token,
        root,
    };
    
    await request.get('/dropbox/fs/', {
        options,
    });
    
    const args = [
        token,
        '/', {
            order: 'asc',
            sort: undefined,
            root,
        },
    ];
    
    t.calledWith(readbox, args, 'should call readbox');
    t.end();
});

test('restbox: get: readbox: sort: time', async (t) => {
    const readbox = stub().returns(stringToStream('hello'));
    const {request} = serveOnce((options) => restbox(options, {
        readbox,
    }));
    
    const options = {
        token: 'hello',
        root: '/',
    };
    
    await request.get('/dropbox/fs/?sort=time&order=desc', {
        options,
    });
    
    const args = ['hello', '/', {
        order: 'desc',
        sort: 'time',
        root: '/',
    }];
    
    t.calledWith(readbox, args, 'should pass sort and order');
    t.end();
});

test('restbox: get: readbox: directory', async (t) => {
    const stream = stringToStream('hello');
    
    Object.assign(stream, {
        type: 'directory',
    });
    
    const readbox = stub().returns(stream);
    const nameStore = fullstore();
    const setHeader = ({name}) => nameStore(name);
    
    const {request} = serveOnce((options) => restbox(options, {
        readbox,
        setHeader,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
    };
    
    await request.get('/dropbox/fs/hi', {
        options,
    });
    
    const result = nameStore();
    const expected = '/hidirectory.json';
    
    t.equal(result, expected);
    t.end();
});

test('restbox: get: path beyond root', async (t) => {
    const {request} = serveOnce(restbox);
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
    const {request} = serveOnce(restbox);
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
    const {request} = serveOnce(restbox);
    const {body} = await request.get('/dropbox/fs/?size');
    
    t.equal(body, '0b');
    t.end();
});

test('restbox: get: readbox: hash', async (t) => {
    const {request} = serveOnce(restbox);
    const {random} = Math;
    
    Math.random = stub().returns(31_337);
    
    const {body} = await request.get('/dropbox/fs/?hash');
    
    Math.random = random;
    
    t.equal(body, '31337');
    t.end();
});
