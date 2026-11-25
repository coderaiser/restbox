import {send} from 'ponse';

export const sendOK = async (msg, request, response) => {
    await send(String(msg), {
        request,
        response,
    });
};
