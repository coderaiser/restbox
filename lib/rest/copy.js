import pullout from 'pullout';
import {copy as _copy} from '@cloudcmd/dropbox';
import format from './common/format.js';
import {sendOK} from './common/send.js';
import _operate from './common/operate.js';

const {parse} = JSON;

export default async ({
    token,
    overrides = {},
}, req, res) => {
    const {
        copy = _copy,
        operate = _operate,
    } = overrides;
    
    const data = await pullout(req);
    
    const {
        from,
        to,
        names,
    } = parse(data);
    
    await operate(copy, token, from, to, names);
    
    const msg = format(names, 'copy');
    sendOK(msg, req, res);
};
