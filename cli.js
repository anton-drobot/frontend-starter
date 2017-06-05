#!/usr/bin/env node

const prog = require('caporal');

const i18nAction = require('./cli/i18n');
const modulesAction = require('./cli/modules');
const apiAction = require('./cli/api');

prog
    .version('1.0.0')
    .description('CLI for frontend-starter')

    .command('generate:i18n', 'Generates internationalization files')
    .option(
        '-n, --namespace <ns>',
        'The global object or modules format for the output JS. If ns does not contain a \'.\', the output follows ' +
        'an UMD pattern. For module support, the values \'export default\' (ES6), \'exports\' (CommonJS), ' +
        'and \'module.exports\' (node.js) are special.',
        ['export default', 'exports', 'module.exports'],
        'export default',
        false
    )
    .option(
        '-p, --disable-plural-key-checks',
        'By default, messageformat.js throws an error when a statement uses a non-numerical key that will never ' +
        'be matched as a pluralization category for the current locale. Use this argument to disable the validation ' +
        'and allow unused plural keys.',
        prog.BOOL,
        false,
        false
    )
    .action(i18nAction)

    .command('generate:modules', 'Generates modules file')
    .action(modulesAction)

    .command('generate:api', 'Generates api file')
    .action(apiAction);

prog.parse(process.argv);
