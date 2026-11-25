import {test} from 'supertape';
import {serveOnce} from 'serve-once';
import {restbox} from './restbox.js';

const {request} = serveOnce(restbox);

test('restbox: no options', async (t) => {
    const {body} = await request.get('/dropbox/fs');
    
    t.equal(body, 'token should be a string!');
    t.end();
});

test('restbox: no options: returns function', (t) => {
    const result = typeof restbox();
    const expected = 'function';
    
    t.equal(result, expected);
    t.end();
});

test('restbox: options', async (t) => {
    const options = {
        prefix: '/xxx',
    };
    
    const {body} = await request.get('/xxx/fs', {
        options,
    });
    
    t.equal(body, 'token should be a string!');
    t.end();
});
