import pullout from 'pullout';
import {move as _move} from '@cloudcmd/dropbox';
import format from './common/format.js';
import {sendOK} from './common/send.js';
import _operate from './common/operate.js';

const {parse} = JSON;

export default async ({
    token,
    overrides = {},
}, req, res) => {
    const {
        move = _move,
        operate = _operate,
    } = overrides;
    
    const data = await pullout(req);
    
    const {
        from,
        to,
        names,
    } = parse(data);
    
    await operate(move, token, from, to, names);
    
    const msg = format(names, 'move');
    sendOK(msg, req, res);
};
