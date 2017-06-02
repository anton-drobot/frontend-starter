const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getModules() {
    const modulesFolder = path.resolve(process.cwd(), 'app', 'modules');

    if (!fs.existsSync(modulesFolder) && fs.statSync(modulesFolder).isDirectory()) {
        throw new Error(`Modules folder not found: ${modulesFolder}`);
    }

    const modules = [];
    const directories = glob.sync(path.join(modulesFolder, '*/'));

    directories.forEach((directory) => {
        const tmp = directory.slice(0, -1);
        modules.push(tmp.substr(tmp.lastIndexOf(path.sep) + 1));
    });

    return modules;
}

function generateResultFile(modules, logger) {
    let output = '';

    modules.forEach((module) => {
        output += `import ${module} from 'app/modules/${module}';\n`;
    });

    output += '\nexport default [\n';
    output += modules.reduce((result, module) => (result += `    ${module},\n`), '');
    output += '];\n';

    const outputFile = path.resolve(process.cwd(), 'app', 'modules', 'index.js');
    fs.writeFileSync(outputFile, output);
    logger.info(`Generated: ${outputFile}`);
}

module.exports = function action(args, options, logger) {
    const modules = getModules();
    generateResultFile(modules, logger);
};
