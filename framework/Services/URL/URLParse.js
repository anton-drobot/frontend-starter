// @flow

import { queryParse, queryStringify } from '../../utils/url/querystring';
import type { LocationInterface } from './LocationInterface';

/**
 * URL parser that works seamlessly across Node.js and browser environments.
 */
export default class URLParse implements LocationInterface {
    /**
     * The protocol scheme of the URL (e.g. "http:").
     */
    protocol: string = '';

    /**
     * Username of basic authentication.
     */
    username: string = '';

    /**
     * Password of basic authentication.
     */
    password: string = '';

    /**
     * Host name with port number.
     */
    host: string = '';

    /**
     * Host name without port number.
     */
    hostname: string = '';

    /**
     * Optional port number.
     */
    port: number | null = null;

    /**
     * URL path.
     */
    pathname: string = '';

    /**
     * The parsed "query string" into object.
     */
    query: Object = {};

    /**
     * The "fragment" portion of the URL including the pound-sign ("#").
     */
    hash: string = '';

    /**
     * A boolean which indicates whether the protocol is followed by two forward slashes ("//").
     *
     * @type {boolean}
     *
     * @protected
     */
    slashes: boolean = false;

    /**
     * @type {string}
     *
     * @private
     */
    _tempAddress: string = '';

    _PROTOCOL_REGEXP: RegExp = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
    _PORT_REGEXP: RegExp = /:(\d+)$/;

    /**
     * @param {string} [address=''] - URL address we want to parse.
     *
     * @return {URLParse}
     */
    constructor(address: string = ''): LocationInterface {
        this.parse(address);

        return this;
    }

    get origin(): string {
        if (this.host && this.protocol !== 'file:') {
            return this.protocol + '//' + this.host;
        }

        return '';
    }

    /**
     * The "query string" including the question sign ("?").
     *
     * @return {string}
     */
    get search(): string {
        if (Object.keys(this.query).length === 0) {
            return '';
        }

        return `?${queryStringify(this.query)}`;
    }

    /**
     * Set "query string".
     *
     * @param value
     */
    set search(value: string): void {
        this.query = queryParse(value);
    }

    /**
     * The full URL.
     *
     * @return {string}
     */
    get href(): string {
        return this.toString();
    }

    /**
     * TODO: действительно нужно?
     *
     * Set new URL address.
     *
     * @return {string} [address='']
     */
    //set href(address: string = ''): void {
    //    // TODO: сбросить параметры в инстансе
    //    this.parse(address);
    //}

    /**
     * Transform the properties back in to a valid and full URL string.
     *
     * @return {string}
     */
    toString(): string {
        let result = '';
        let protocol = this.protocol;

        if (protocol && protocol.charAt(protocol.length - 1) !== ':') {
            protocol += ':';
        }

        result += protocol + (this.slashes ? '//' : '');

        if (this.username) {
            result += this.username;

            if (this.password) {
                result += ':' + this.password;
            }

            result += '@';
        }

        result += this.host + this.pathname;

        if (this.host && !this.pathname && (this.search || this.hash)) {
            result += '/';
        }

        if (this.search) {
            result += this.search;
        }

        if (this.hash) {
            result += this.hash.charAt(0) !== '#' ? '#' + this.hash : this.hash;
        }

        return result;
    }

    /**
     * TODO: memoize
     *
     * Parse address.
     *
     * @param address
     *
     * @protected
     */
    parse(address: string): void {
        this._tempAddress = address;

        this._setProtocol();
        this._setHash();
        this._setQuery();
        this._setPathname();
        this._setAuth();
        this._setHost();
        this._setPort();
        this._setHostname();

        this._tempAddress = '';

        /**
         * We should not add port numbers if they are already the default port number
         * for a given protocol. As the host also contains the port number we're going
         * override it with the hostname which contains no port number.
         */
        if (!this._isPortRequired(this.port, this.protocol)) {
            this.host = this.hostname;
            this.port = null;
        }
    }

    /**
     * Set protocol.
     *
     * @private
     */
    _setProtocol(): void {
        const match = this._PROTOCOL_REGEXP.exec(this._tempAddress);

        this.protocol = match[1] ? match[1].toLowerCase() : '';
        this.slashes = Boolean(match[2]);
        this._tempAddress = match[3];
    }

    /**
     * Set hash.
     *
     * @private
     */
    _setHash(): void {
        const index = this._tempAddress.indexOf('#');

        if (index > -1) {
            this.hash = this._tempAddress.slice(index);
            this._tempAddress = this._tempAddress.slice(0, index);
        }
    }

    /**
     * Set query.
     *
     * @private
     */
    _setQuery(): void {
        const index = this._tempAddress.indexOf('?');

        if (index > -1) {
            this.query = queryParse(this._tempAddress.slice(index + 1));
            this._tempAddress = this._tempAddress.slice(0, index);
        }
    }

    /**
     * Set pathname.
     *
     * @private
     */
    _setPathname(): void {
        /**
         * When the authority component is absent the URL starts with a path component.
         */
        if (!this.slashes || this.protocol === 'file:') {
            this.pathname = this._tempAddress;
            this._tempAddress = '';
        } else {
            const index = this._tempAddress.indexOf('/');

            if (index > 0) {
                this.pathname = this._tempAddress.slice(index);
                this._tempAddress = this._tempAddress.slice(0, index);
            }

            /**
             * Required for consistency when parsing values like "http://example.com/" and "http://example.com".
             */
            if (this.pathname === '') {
                this.pathname = '/';
            }
        }
    }

    /**
     * Set username and password.
     *
     * @private
     */
    _setAuth(): void {
        const index = this._tempAddress.indexOf('@');

        if (index > -1) {
            const auth = this._tempAddress.slice(0, index);
            const [username, password = ''] = auth.split(':');

            this.username = username;
            this.password = password;
            this._tempAddress = this._tempAddress.slice(index + 1);
        }
    }

    /**
     * Set host and convert into lowercase.
     *
     * @private
     */
    _setHost(): void {
        this.host = this._tempAddress.toLowerCase();
    }

    /**
     * Set port.
     *
     * @private
     */
    _setPort(): void {
        const match = this._PORT_REGEXP.exec(this._tempAddress);

        if (match) {
            this.port = Number(match[1]);
            this._tempAddress = this._tempAddress.slice(0, match.index);
        }
    }

    /**
     * Set hostname and convert into lowercase.
     *
     * @private
     */
    _setHostname(): void {
        this.hostname = this._tempAddress.toLowerCase();
    }

    /**
     * Check if we're required to add a port number.
     *
     * @see https://url.spec.whatwg.org/#default-port
     *
     * @param {number|null} port - Port number we need to check.
     * @param {string} protocol - Protocol we need to check against.
     *
     * @return {boolean} Is it a default port for the given protocol.
     */
    _isPortRequired(port: number | null, protocol: string): boolean {
        if (!port) {
            return false;
        }

        switch (protocol) {
            case 'http:':
            case 'ws:':
                return port !== 80;

            case 'https:':
            case 'wss:':
                return port !== 443;

            case 'ftp:':
                return port !== 21;
        }

        return port !== 0;
    };
}
