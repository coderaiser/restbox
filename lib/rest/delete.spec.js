import {test, stub} from 'supertape';
import {serveOnce} from 'serve-once';
import {restbox} from '../restbox.js';

const resolve = stub().resolves();

test('restbox: delete: no token', async (t) => {
    const {request} = serveOnce(restbox);
    const {body} = await request.delete('/dropbox/fs/temp');
    
    t.equal(body, 'token should be a string!', 'should return error message');
    t.end();
});

test('restbox: delete: dropbox.remove', async (t) => {
    const remove = stub(resolve);
    const {request} = serveOnce((options) => restbox(options, {
        remove,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
    };
    
    await request.delete('/dropbox/fs/', {
        options,
    });
    
    t.calledWith(remove, [token, '/'], 'should call remove with token');
    t.end();
});

test('restbox: delete: root: dropbox.remove', async (t) => {
    const remove = stub(resolve);
    const {request} = serveOnce((options) => restbox(options, {
        remove,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
        root: '/tmp',
    };
    
    await request.delete('/dropbox/fs/', {
        options,
    });
    
    t.calledWith(remove, [token, '/tmp/'], 'should call remove with token');
    t.end();
});

test('restbox: delete', async (t) => {
    const remove = stub(resolve);
    const {request} = serveOnce((options) => restbox(options, {
        remove,
    }));
    
    const token = 'hello';
    
    const options = {
        token,
    };
    
    const {body} = await request.delete('/dropbox/fs/', {
        options,
    });
    
    t.equal(body, 'delete: ok("/")');
    t.end();
});

test('restbox: delete: dropbox.remove: files', async (t) => {
    const operate = stub(resolve);
    const remove = stub(resolve);
    
    const {request} = serveOnce((options) => restbox(options, {
        remove,
        operate,
    }));
    
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
    
    t.calledWith(operate, [
        remove,
        token,
        '/',
        files,
    ], 'should call remove with token');
    t.end();
});
