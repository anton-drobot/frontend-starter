// @flow

import { parse, stringify } from 'qs';

type StringifyOptions = {
    encode?: boolean,
    encoder?: Function,
    arrayFormat?: 'indices' | 'brackets' | 'repeat',
    strictNullHandling?: boolean
};

type ParseOptions = {
    decoder?: boolean,
    strictNullHandling?: boolean
};

/**
 * This function is convenient when encoding a string to be used in a query part of a URL, as a convenient way to pass
 * variables to the next page.
 *
 * @param {string} string - The string to be encoded.
 *
 * @returns {string}
 */
function urlEncode(string: string): string {
    return encodeURIComponent(string)
        .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function urlDecode(string: string): string {
    return decodeURIComponent(string);
}

export function queryParse(query: string, options: ParseOptions = {}): Object {
    const qsOptions = {
        decoder: options.decoder || urlDecode,
        strictNullHandling: Object.prototype.toString.call(options.strictNullHandling) === '[object Boolean]' ?
            options.strictNullHandling :
            true
    };

    return parse(query, qsOptions);
}

export function queryStringify(query: Object, options: StringifyOptions = {}): string {
    const qsOptions = {
        encode: Object.prototype.toString.call(options.encode) === '[object Boolean]' ?
            options.encode :
            true,
        encoder: options.encoder || urlEncode,
        encodeValuesOnly: true,
        arrayFormat: options.arrayFormat || 'indices',
        strictNullHandling: Object.prototype.toString.call(options.strictNullHandling) === '[object Boolean]' ?
            options.strictNullHandling :
            true
    };

    return stringify(query, qsOptions);
}
