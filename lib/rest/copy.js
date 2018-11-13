'use strict';

const pullout = require('pullout');
const {copy} = require('@cloudcmd/dropbox');

const format = require('./common/format');
const {sendOK} = require('./common/send');

const {parse} = JSON;
const operate = require('./common/operate');

module.exports = async({token}, req, res) => {
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

