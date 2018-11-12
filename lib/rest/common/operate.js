'use strict';

const {join} = require('path');

const COPY_MOVE = 3;

module.exports = async (fn, token, ...args) => {
    if (args.length === COPY_MOVE)
        return operateFromTo(fn, token, ...args);
    
    return operate(fn, token, ...args);
};

async function operateFromTo(fn, token, from, to, names) {
    for (const name of names) {
        const fromFull = join(from, name);
        const toFull = join(to, name);
        
        await fn(token, fromFull, toFull);
    }
}

async function operate(fn, token, dir, names) {
    for (const name of names) {
        const full = join(dir, name);
        await fn(token, full);
    }
}

