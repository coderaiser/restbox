'use strict';

const {send} = require('ponse');

module.exports.sendOK = async (msg, request, response) => {
    await send(String(msg), {
        request,
        response,
    });
};
