const fs = require('fs');
const path = require('path');
const glob = require('glob');
const MessageFormat = require('messageformat');

/**
 * Get internationalization files.
 *
 * @returns {String[]}
 *
 * @example
 * getI18nFiles();
 * // Output array contains:
 * // /Users/USERNAME/frontend-starter/app/modules/demo/lang/en.json
 * // /Users/USERNAME/frontend-starter/app/modules/demo/lang/ru.json
 * // ...
 */
function getI18nFiles() {
    const modulesFolder = path.resolve(process.cwd(), 'app', 'modules');

    if (!fs.existsSync(modulesFolder) && fs.statSync(modulesFolder).isDirectory()) {
        throw new Error(`Modules folder not found: ${modulesFolder}`);
    }

    return glob.sync(path.join(modulesFolder, '*', 'lang', '*.json'));
}

function makeI18nObjectFromFiles(files) {
    const result = {};

    files.forEach((file) => {
        const parts = file.slice(process.cwd().length + 1).split(path.sep);
        const moduleName = parts[2];
        const locale = parts[4].slice(0, -5);

        if (!result[locale]) {
            result[locale] = {};
        }

        result[locale] = Object.assign({}, result[locale], { [moduleName]: require(file) });
    });

    return result;
}

function generateI18nFiles(i18n, options, logger) {
    const generatedFiles = {};

    Object.keys(i18n).forEach((locale) => {
        const mf = new MessageFormat(locale);

        if (options.disablePluralKeyChecks) {
            mf.disablePluralKeyChecks();
        }

        const output = mf.compile(i18n[locale]).toString(options.namespace);
        const outputDirectory = path.resolve(process.cwd(), 'app', 'i18n', 'locales');
        const outputFile = path.resolve(outputDirectory, `${locale}.js`);

        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }

        fs.writeFileSync(outputFile, output);
        generatedFiles[locale] = `app/i18n/locales/${locale}`;
        logger.info(`Generated: ${outputFile}`);
    });

    return generatedFiles;
}

function generateResultFile(generatedFiles, logger) {
    let output = '';

    Object.keys(generatedFiles).forEach((locale) => {
        output += `import ${locale} from '${generatedFiles[locale]}';\n`;
    });

    output += '\nexport default {\n';
    output += Object.keys(generatedFiles).reduce((result, locale) => (result += `    ${locale},\n`), '');
    output += '};\n';

    const outputFile = path.resolve(process.cwd(), 'app', 'i18n', 'index.js');
    fs.writeFileSync(outputFile, output);
    logger.info(`Generated: ${outputFile}`);
}



module.exports = function action(args, options, logger) {
    const files = getI18nFiles();
    const i18n = makeI18nObjectFromFiles(files);
    const generatedFiles = generateI18nFiles(i18n, options, logger);
    generateResultFile(generatedFiles, logger);
};
