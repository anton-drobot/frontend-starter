// @flow

import URL from 'url-parse';
import pathToRegexp from 'path-to-regexp';

import type { LocationInterface } from './LocationInterface';

import { allExtensions } from '../fileDefinitions';

import inject from '../../IoC/inject';
import { CONFIG_PROVIDER } from '../../Providers/types';

/**
 * Parse a URL and return its components.
 *
 * @param {string} url
 *
 * @return {LocationInterface}
 */
export function parse(url: string): LocationInterface {
    return new URL(url, true);
}

/**
 * Checks if URL is absolute.
 *
 * @param {string} url
 *
 * @return {boolean}
 */
export function isAbsoluteUrl(url: string): boolean {
    return parse(url).host.length > 0;
}

/**
 * Checks if URL is local application URL.
 *
 * @param {string} url
 *
 * @return {boolean}
 */
export const isAppUrl = inject(CONFIG_PROVIDER)(function (config: Object, url: string): boolean {
    return url.indexOf(config.get('app.baseUrl')) === 0;
});

/**
 * Returns absolute URL to the application.
 *
 * @param {string} path
 * @param {?Object} [params=null]
 * @param {?Object} [options]
 * @param {?boolean} [options.baseUrl=true]
 *
 * @return {string}
 *
 * @example
 * appUrl('/'); // http://site.tld/
 * appUrl('/path/'); // http://site.tld/path/
 * appUrl('http://other-site.tld/'); // http://other-site.tld/
 */
export const appUrl = inject(CONFIG_PROVIDER)(function (config: Object, path: string, params?: Object | null = null, { baseUrl = true }: { baseUrl: boolean } = {}) {
    if (params) {
        const compile = pathToRegexp.compile(path);
        path = compile(params);
    }

    path = normalizePath(path);

    return new URL(path, baseUrl ? config.get('app.baseUrl') : null).toString();
});

/**
 * This function is convenient when encoding a string to be used in a query part of a URL, as a convenient way to pass
 * variables to the next page.
 *
 * @param {string} string - the string to be encoded
 *
 * @returns {string}
 */
export function urlEncode(string: string): string {
    return encodeURIComponent(string)
        .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16)}`)
        .replace(/%20/g, '+');
}

/*function _buildQueryHelper(key, value, argSeparator = '&') {
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
}*/

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

/*export function buildQuery(data = {}, numericPrefix, argSeparator = '&') {
    return Object.keys(data)
        .map((key) => {
            const value = data[key];

            if (numericPrefix && !isNaN(key)) {
                key = String(numericPrefix) + key;
            }

            return _buildQueryHelper(key, value, argSeparator);
        })
        .join(argSeparator);
}*/

/**
 * Get extension if it exists.
 *
 * @param {string} url
 *
 * @return {?string}
 */
export function getExtension(url: string): string | null {
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
 * @param {string} url
 *
 * @return {boolean}
 */
export function isAvailableFile(url: string): boolean {
    const extension = getExtension(url);

    if (!extension) {
        return false;
    }

    return allExtensions().includes(extension);
}

/**
 * Normalize route path. Add or delete slash before and after if it necessary.
 *
 * @param {string} path
 *
 * @return {string}
 */
export const normalizePath = inject(CONFIG_PROVIDER)(function (config: Object, path: string): string {
    if (path.indexOf('/') !== 0) {
        path = `/${path}`;
    }

    if (!isAvailableFile(path)) {
        if (config.get('app.trailingSlash') === true) {
            if (path.lastIndexOf('/') !== (path.length - 1)) {
                path = `${path}/`;
            }
        }

        if (config.get('app.trailingSlash') === false) {
            if (path.lastIndexOf('/') === (path.length - 1)) {
                path = path.slice(0, -1);
            }
        }
    }

    return path;
});
