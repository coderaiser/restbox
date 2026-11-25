import {test, stub} from 'supertape';
import {serveOnce} from 'serve-once';
import {restbox} from '../restbox.js';

test('restbox: move: no token', async (t) => {
    const {request} = serveOnce(restbox);
    
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
    const move = stub();
    
    const {request} = serveOnce((options) => restbox(options, {
        operate,
        move,
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
    
    await request.put('/dropbox/mv', {
        body,
        options,
    });
    
    t.calledWith(operate, [
        move,
        token,
        '/',
        '/tmp',
        names,
    ], 'should call operate with token');
    t.end();
});

test('restbox: move: response', async (t) => {
    const operate = stub().returns(Promise.resolve());
    
    const {request} = serveOnce((options) => restbox(options, {
        operate,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
    };
    
    const {body} = await request.put('/dropbox/mv', {
        body: {
            from: '/',
            to: '/tmp',
            names: ['1.txt'],
        },
        options,
    });
    
    t.equal(body, 'move: ok("1.txt")');
    t.end();
});
