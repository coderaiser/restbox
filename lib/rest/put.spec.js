import {once} from 'node:events';
import {test, stub} from 'supertape';
import through2 from 'through2';
import wait from '@iocmd/wait';
import {serveOnce} from 'serve-once';
import {restbox} from '../restbox.js';

const emitMetadataOnceFinish = (stream) => async () => {
    await once(stream, 'finish');
    await wait(stream.emit.bind(stream), 'metadata');
};

test('restbox: put: no token', async (t) => {
    const {request} = serveOnce(restbox);
    const {body} = await request.put('/dropbox/fs/temp');
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: put: mkdir', async (t) => {
    const mkdir = stub().returns(Promise.resolve());
    
    const {request} = serveOnce((options) => restbox(options, {
        mkdir,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
    };
    
    await request.put('/dropbox/fs/hello?dir', {
        options,
    });
    
    t.calledWith(mkdir, [token, '/hello'], 'should call mkdir with token');
    t.end();
});

test('restbox: put: mkdir: response', async (t) => {
    const mkdir = stub().returns(Promise.resolve());
    
    const {request} = serveOnce((options) => restbox(options, {
        mkdir,
    }));
    
    const options = {
        token: 'hello',
    };
    
    const {body} = await request.put('/dropbox/fs/hello?dir', {
        options,
    });
    
    t.equal(body, 'make dir: ok("/hello")');
    t.end();
});

test('restbox: put: response', async (t) => {
    const stream = through2((chunk, enc, fn) => fn(null, chunk));
    const createWriteStream = stub().returns(stream);
    
    const {request} = serveOnce((options) => restbox(options, {
        createWriteStream,
    }));
    
    const options = {
        token: 'hello',
    };
    
    const [{body}] = await Promise.all([
        request.put('/dropbox/fs/hi.txt', {
            body: 'hello',
            options,
        }),
        wait(emitMetadataOnceFinish(stream)),
    ]);
    
    t.equal(body, 'save: ok("/hi.txt")');
    t.end();
});

test('restbox: put: createWriteStream', async (t) => {
    const stream = through2((chunk, enc, fn) => fn(null, chunk));
    const createWriteStream = stub().returns(stream);
    
    const {request} = serveOnce((options) => restbox(options, {
        createWriteStream,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
    };
    
    await Promise.all([
        request.put('/dropbox/fs/hi.txt', {
            body: 'hello',
            options,
        }),
        wait(emitMetadataOnceFinish(stream)),
    ]);
    
    t.calledWith(createWriteStream, [token, '/hi.txt'], 'should call createWriteStream');
    t.end();
});

test('restbox: put: unzip', async (t) => {
    const stream = through2((chunk, enc, fn) => fn(null, chunk));
    const createWriteStream = stub().returns(stream);
    
    const {request} = serveOnce((options) => restbox(options, {
        createWriteStream,
    }));
    
    const options = {
        token: 'hello',
    };
    
    const {body} = await request.put('/dropbox/fs/hi.txt?unzip', {
        body: 'hello',
        options,
    });
    
    t.equal(body, 'incorrect header check');
    t.end();
});
