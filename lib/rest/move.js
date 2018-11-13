'use strict';

const pullout = require('pullout');
const {move} = require('@cloudcmd/dropbox');

const format = require('./common/format');
const {sendOK} = require('./common/send');
const operate = require('./common/operate');

const {parse} = JSON;

module.exports = async ({token}, req, res) => {
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

