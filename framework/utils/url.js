import pathToRegexp from 'path-to-regexp'
import Config from 'framework/Config';
import FileDefinitions from 'framework/FileDefinitions';

/**
 * Checks if URL is absolute.
 *
 * @param {String} url
 *
 * @return {Boolean}
 */
export function isAbsoluteUrl(url) {
    return (url.indexOf('http') === 0 || url.indexOf('//') === 0);
}

/**
 * Returns absolute URL to the application.
 *
 * @param {String} path
 * @param {?Object} [params=null]
 * @param {Object} [options]
 * @param {Boolean} [options.baseUrl=true]
 *
 * @return {String}
 *
 * @example
 * appUrl('/'); // http://site.tld/
 * appUrl('/path/'); // http://site.tld/path/
 * appUrl('http://other-site.tld/'); // http://other-site.tld/
 */
export function appUrl(path, params = null, options = { baseUrl: true }) {
    let url = path;

    if (!isAbsoluteUrl(path)) {
        if (params) {
            const compile = pathToRegexp.compile(path);
            path = compile(params);
        }

        url = (options.baseUrl ? Config.get('app.baseUrl') : '') + normalizePath(path);
    }

    return url;
}

/**
 * Checks if URL is local application URL.
 *
 * @param {String} url
 * @return {Boolean}
 */
export function isAppUrl(url) {
    return url.indexOf(Config.get('app.baseUrl')) === 0;
}

/**
 * Parse a URL and return its components.
 *
 * url - given url
 * scheme - for example, http
 * host - with user, password, host and port
 * path
 * query - after the question mark ?
 * fragment - after the hashmark #
 *
 * @param {String} url
 *
 * @return {{url: String, scheme: ?String, host: ?String, path: ?String, query: ?String, fragment: ?String}}
 */
export function parseUrl(url) {
    const regex = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
    const result = regex.exec(url);

    return {
        url,
        scheme: result[2] || null,
        host: result[4] || null,
        path: result[5] || null,
        query: result[7] || null,
        fragment: result[9] || null
    };
}

/**
 * Normalize route path. Add or delete slash before and after if it necessary.
 *
 * @param {String} path
 *
 * @return {String}
 */
export function normalizePath(path) {
    if (path.indexOf('/') !== 0) {
        path = `/${path}`;
    }

    if (!isAvailableFile(path)) {
        if (Config.get('app.trailingSlash') === true) {
            if (path.lastIndexOf('/') !== (path.length - 1)) {
                path = `${path}/`;
            }
        }

        if (Config.get('app.trailingSlash') === false) {
            if (path.lastIndexOf('/') === (path.length - 1)) {
                path = path.slice(0, -1);
            }
        }
    }

    return path;
}

/**
 * Check if URL is available file.
 *
 * @param {String} url
 *
 * @return {Boolean}
 */
export function isAvailableFile(url) {
    const extension = getExtension(url);

    if (!extension) {
        return false;
    }

    return FileDefinitions.get('all').includes(extension);
}

/**
 * Get extension if it exists.
 *
 * @param {String} url
 *
 * @return {?String}
 */
export function getExtension(url) {
    const path = parseUrl(url).path;

    if (!path) {
        return null;
    }

    const basename = path.substr(path.lastIndexOf('/') + 1);
    const dotIndex = basename.lastIndexOf('.');

    if (dotIndex === -1) {
        return null;
    }

    return basename.substr(dotIndex + 1);
}
