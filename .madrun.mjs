import {run} from 'madrun';

export default {
    'test': () => `tape 'lib/**/*.spec.js'`,
    'report': () => 'c8 report --reporter=lcov',
    'coverage': () => 'c8 npm test',
    'watch:test': () => run('watcher', 'npm test'),
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watcher': () => 'nodemon -w test -w lib --exec',
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
};
