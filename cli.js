#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');
const nopt = require('nopt');
const path = require('path');

const MessageFormat = require('messageformat');

const knownOptions = {
    help: Boolean,
    namespace: String,
    'disable-plural-key-checks': Boolean
};

const shortHands = {
    h: ['--help'],
    n: ['--namespace'],
    p: ['--disable-plural-key-checks']
};

const options = nopt(knownOptions, shortHands, process.argv, 2);

if (options.help) {
    printUsage();

    return;
}

const foldersToScan = [
    path.resolve(process.cwd(), 'app', 'modules')
];

const translationsFiles = scanFolders(foldersToScan, '.json');
const translations = makeTranslationsObjects(translationsFiles);
const namespace = options.namespace || 'module.exports';

Object.keys(translations).forEach((moduleName) => {
    Object.keys(translations[moduleName]).forEach((locale) => {
        const mf = new MessageFormat(locale);

        if (options['disable-plural-key-checks']) {
            mf.disablePluralKeyChecks();
        }

        const output = mf.compile(translations[moduleName][locale]).toString(namespace);
        const dir = path.resolve(process.cwd(), 'app', 'i18n', moduleName);
        const filenamePath = path.resolve(dir, `${locale}.js`);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFile(filenamePath, output, function(err) {
            if (err) {
                return console.log(err);
            }

            console.log(`Build: ${filenamePath}`);
        });
    });
});

function printUsage() {
    let usage = [
        'usage: *cli* [*-n* _ns_] [*-p*]',
        '',
        'Parses the JSON file(s) of MessageFormat strings into a JS module of',
        'corresponding hierarchical functions, written to stdout. Directories are',
        'scanned for all .json files.',
        '',
        '  *-n* _ns_, *--namespace*=_ns_',
        '        The global object or modules format for the output JS. If _ns_ does not',
        '        contain a \'.\', the output follows an UMD pattern. For module support,',
        '        the values \'*export default*\' (ES6), \'*exports*\' (CommonJS), and',
        '        \'*module.exports*\' (node.js) are special. [default: *module.exports*]',
        '',
        '  *-p*, *--disable-plural-key-checks*',
        '        By default, messageformat.js throws an error when a statement uses a',
        '        non-numerical key that will never be matched as a pluralization',
        '        category for the current locale. Use this argument to disable the',
        '        validation and allow unused plural keys. [default: *false*]'
    ].join('\n');

    if (process.stdout.isTTY) {
        usage = usage.replace(/_(.+?)_/g, '\x1B[4m$1\x1B[0m')
            .replace(/\*(.+?)\*/g, '\x1B[1m$1\x1B[0m');
    } else {
        usage = usage.replace(/[_*]/g, '');
    }

    console.log(usage);
}

function makeTranslationsObjects(files) {
    const result = {};

    files.forEach((file) => {
        const parts = file.slice(process.cwd().length + 1, -1 * '.json'.length).split(path.sep);
        const moduleName = parts[2];
        const locale = parts[4];

        if (!result[moduleName]) {
            result[moduleName] = {};
        }

        result[moduleName] = Object.assign({}, result[moduleName], { [locale]: require(file) });
    });

    return result;
}

function scanFolders(folders, extension) {
    const files = [];

    folders.forEach((folder) => {
        if (!fs.existsSync(folder)) {
            throw new Error(`Input file not found: ${folder}`);
        }

        if (fs.statSync(folder).isDirectory()) {
            files.push.apply(files, glob.sync(path.join(folder, '**/*' + extension)));
        } else {
            if (folder.extname(folder) !== extension) {
                throw new Error(`Input file extension is not ${extension}: ${folder}`);
            }

            files.push(folder);
        }
    });

    return files;
}
