'use strict';

const {run} = require('madrun');

module.exports = {
    'test': () => 'tape \'lib/**/*.spec.js\'',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'coverage': () => 'nyc npm test',
    'watch:test': () => run('watcher', 'npm test'),
    'watch:lint': () => run('watcher', '\'npm run lint\''),
    'watcher': () => 'nodemon -w test -w lib --exec',
    'lint': () => 'putout lib *.js *.md',
    'fix:lint': () => run('lint', '--fix'),
};

