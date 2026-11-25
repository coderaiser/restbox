import {parse} from 'node:querystring';
import {readbox as _readbox} from 'readbox';
import {
    getQuery,
    getPathName,
    setHeader as _setHeader,
} from 'ponse';
import {sendOK} from './common/send.js';

export default async ({token, 
    root,
    overrides = {},
}, req, res) => {
    const name = getPathName(req);
    const query = getQuery(req);
    
    if (query === 'hash')
        return sendOK(Math.random(), req, res);
    
    return await read({
        token,
        root,
        overrides,
    }, name, req, res);
};

async function read({token, root, overrides}, name, request, response) {
    const {
        readbox = _readbox,
        setHeader = _setHeader,
    } = overrides;
    
    const query = getQuery(request);
    
    if (query === 'size')
        return response.send('0b');
    
    const {sort, order = 'asc'} = parse(query);
    
    const stream = await readbox(token, name, {
        sort,
        order,
        root,
    });
    
    const {type} = stream;
    
    if (type === 'directory')
        name += 'directory.json';
    
    setHeader({
        name,
        request,
        response,
    });
    
    stream.pipe(response);
}
