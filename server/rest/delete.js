'use strict';

const {promisify} = require('util');
const pullout = promisify(require('pullout'));
const {remove} = require('@cloudcmd/dropbox');

const {
    getPathName,
} = require('ponse');

const operate = require('./common/operate');

const {
    sendOK,
} = require('./common/send');

const format = require('./common/format');

const {parse} = JSON;

module.exports = async ({token}, req, res) => {
    const {url} = req;
    const dir = getPathName(url);
    
    const body = await pullout(req);
    const names = parse(body);
    
    await operate(remove, token, dir, names);
    
    const msg = format(dir, 'delete');
    sendOK(msg, req, res);
};

