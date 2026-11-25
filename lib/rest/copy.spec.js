import {test, stub} from 'supertape';
import {serveOnce} from 'serve-once';
import {restbox} from '../restbox.js';

test('restbox: copy: no token', async (t) => {
    const {request} = serveOnce(restbox);
    
    const {body} = await request.put('/dropbox/cp', {
        body: {
            from: '/',
            to: '/tmp',
            names: ['1.txt'],
        },
    });
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: copy', async (t) => {
    const operate = stub().returns(Promise.resolve());
    const copy = stub();
    
    const {request} = serveOnce((options) => restbox(options, {
        operate,
        copy,
    }));
    
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
    
    await request.put('/dropbox/cp', {
        body,
        options,
    });
    
    t.calledWith(operate, [
        copy,
        token,
        '/',
        '/tmp',
        names,
    ], 'should call operate with token');
    t.end();
});

test('restbox: copy: response', async (t) => {
    const operate = stub().returns(Promise.resolve());
    
    const {request} = serveOnce((options) => restbox(options, {
        operate,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
    };
    
    const {body} = await request.put('/dropbox/cp', {
        body: {
            from: '/',
            to: '/tmp',
            names: ['1.txt'],
        },
        options,
    });
    
    t.equal(body, 'copy: ok("1.txt")');
    t.end();
});
