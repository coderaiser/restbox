import pullout from 'pullout';
import {remove as _remove} from '@cloudcmd/dropbox';
import {getPathName, getQuery} from 'ponse';
import _operate from './common/operate.js';
import {sendOK} from './common/send.js';
import format from './common/format.js';

const {parse} = JSON;

export default async ({
    token,
    overrides = {},
}, req, res) => {
    const {
        remove = _remove,
        operate = _operate,
    } = overrides;
    
    const query = getQuery(req);
    const dir = getPathName(req);
    
    if (query !== 'files') {
        await remove(token, dir);
        const msg = format(dir, 'delete');
        await sendOK(msg, req, res);
        
        return;
    }
    
    const body = await pullout(req);
    const names = parse(body);
    
    await operate(remove, token, dir, names);
    
    const msg = format(dir, 'delete');
    await sendOK(msg, req, res);
};
