'use strict';

const {send} = require('ponse');

module.exports.sendOK = (msg, request, response) => {
    send(String(msg), {
        request,
        response,
    });
};

