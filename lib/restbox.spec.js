'use strict';

const {promisify} = require('util');

const express = require('express');
const http = require('http');

const restbox = require('./restbox');
const fetch = require('node-fetch');
const {serve} = require('serve-once')(restbox);

const tryToCatch = require('try-to-catch');
const currify = require('currify');

const tryToTape = require('try-to-tape');
const test = tryToTape(require('tape'));

test('restbox: no options', async (t) => {
    const {port, close} = await serve();
    const response = await fetch(`http://localhost:${port}/dropbox/fs/`);
    const result = await response.text();
    
    await close();
    
    t.equal(result, 'token should be a string!', 'should equal');
    t.end();
});

