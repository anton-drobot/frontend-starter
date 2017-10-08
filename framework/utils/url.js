import URL from 'url-parse';
import pathToRegexp from 'path-to-regexp';

import { allExtensions } from './fileDefinitions';

import { CONFIG_PROVIDER } from '../Providers/types';

/**
 * Location interface.
 *
 * @typedef {Object} Location
 *
 * @property {String} protocol - The protocol scheme of the URL (e.g. "http:").
 * @property {Boolean} slashes - A boolean which indicates whether the protocol is followed by two forward slashes ("//").
 * @property {String} auth - Authentication information portion (e.g. "username:password").
 * @property {String} username - Username of basic authentication.
 * @property {String} password - Password of basic authentication.
 * @property {String} host - Host name with port number.
 * @property {String} hostname - Host name without port number.
 * @property {String} port - Optional port number.
 * @property {String} pathname - URL path.
 * @property {Object|Boolean} query - arsed object containing query string, unless parsing is set to false.
 * @property {String} hash - The "fragment" portion of the URL including the pound-sign ("#").
 * @property {String} href - The full URL.
 * @property {String} origin - The origin of the URL.
 * @property {Function} set - Change parts of the URL.
 * @property {Function} toString - Generates a full URL.
 */

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 *
 * @return {Location}
 */
export function parse(url) {
    return new URL(url, true);
}

/**
 * Checks if URL is absolute.
 *
 * @param {String} url
 *
 * @return {Boolean}
 */
export function isAbsoluteUrl(url) {
    return parse(url).host.length > 0;
}

/**
 * Checks if URL is local application URL.
 *
 * @param {String} url
 * @return {Boolean}
 */
export function isAppUrl(url) {
    const Config = global.Container.make(CONFIG_PROVIDER);

    return url.indexOf(Config.get('app.baseUrl')) === 0;
}

/**
 * Returns absolute URL to the application.
 *
 * @param {String|Object} path
 * @param {?Object} [params=null]
 * @param {?Object} [options]
 * @param {?Boolean} [options.baseUrl=true]
 *
 * @return {String}
 *
 * @example
 * appUrl('/'); // http://site.tld/
 * appUrl('/path/'); // http://site.tld/path/
 * appUrl('http://other-site.tld/'); // http://other-site.tld/
 */
export function appUrl(path, params = null, { baseUrl = true } = {}) {
    const Config = global.Container.make(CONFIG_PROVIDER);

    if (params) {
        const compile = pathToRegexp.compile(path);
        path = compile(params);
    }

    path = normalizePath(path);

    return new URL(path, baseUrl ? Config.get('app.baseUrl') : null).toString();
}

/**
 * This function is convenient when encoding a string to be used in a query part of a URL, as a convenient way to pass
 * variables to the next page.
 *
 * @param {String} string - the string to be encoded
 *
 * @returns {String}
 */
export function urlEncode(string) {
    return encodeURIComponent(string)
        .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16)}`)
        .replace(/%20/g, '+');
}

function _buildQueryHelper(key, value, argSeparator = '&') {
    if (value === null) {
        return;
    } else if (value === true) {
        value = '1';
    } else if (value === false) {
        value = '0';
    }

    if (typeof value === 'object') {
        return Object.keys(value)
            .map((nestedKey) => {
                return _buildQueryHelper(`${key}[${nestedKey}]`, value[nestedKey], argSeparator = '&');
            })
            .join(argSeparator);
    }

    return `${urlEncode(key)}=${urlEncode(value)}`;
}

/**
 * Generates a URL-encoded query string from the object.
 *
 * @param {Object} data - object with properties
 * @param {String} [numericPrefix] - if numeric indices are used in the base object and this parameter is provided,
 * it will be prepended to the numeric index for elements in the base object only.
 * @param {String} [argSeparator] - symbol for separating arguments
 *
 * @returns {String}
 */
export function buildQuery(data = {}, numericPrefix, argSeparator = '&') {
    return Object.keys(data)
        .map((key) => {
            const value = data[key];

            if (numericPrefix && !isNaN(key)) {
                key = String(numericPrefix) + key;
            }

            return _buildQueryHelper(key, value, argSeparator);
        })
        .join(argSeparator);
}

/**
 * Get extension if it exists.
 *
 * @param {String} url
 *
 * @return {?String}
 */
export function getExtension(url) {
    const path = parse(url).pathname;

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

    return allExtensions().includes(extension);
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
        const Config = global.Container.make(CONFIG_PROVIDER);

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
