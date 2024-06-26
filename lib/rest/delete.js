'use strict';

const pullout = require('pullout');
const {remove} = require('@cloudcmd/dropbox');

const {getPathName, getQuery} = require('ponse');

const operate = require('./common/operate');
const {sendOK} = require('./common/send');
const format = require('./common/format');

const {parse} = JSON;

module.exports = async ({token}, req, res) => {
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
