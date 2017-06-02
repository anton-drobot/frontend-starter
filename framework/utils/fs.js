import fs from 'fs';
import path from 'path';

export function scanDirectory(directory, options = {}) {
    const result = [];
    const defaultOptions = {
        directories: true,
        files: true,
        ignoreHidden: true
    };

    options = Object.assign({}, defaultOptions, options);

    if (!fs.existsSync(directory)) {
        throw new Error(`Input directory not found: ${directory}`);
    }

    fs.readdirSync(directory).forEach((item) => {
        const isDirectory = fs.statSync(path.resolve(directory, item)).isDirectory();

        if (!options.directories && isDirectory) {
            return;
        }

        if (!options.files && !isDirectory) {
            return;
        }

        if (options.ignoreHidden && item.indexOf('.') === 0) {
            return;
        }

        result.push(item);
    });

    return result;
}
