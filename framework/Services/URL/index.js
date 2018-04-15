// @flow

import trimEnd from 'lodash/trimEnd';
import pathToRegexp from 'path-to-regexp';

import URLParse from './URLParse';

import type { URLInterface } from './URLInterface';

export default class URL extends URLParse implements URLInterface {
    _config: Object;

    /**
     * Available extensions for current application.
     *
     * @return {string[]}
     *
     * @private
     */
    _availableExtensions: string[];

    constructor(config: Object, address: string | URL = ''): URLInterface {
        if (address instanceof URL) {
            address = address.toString();
        }

        super(address);

        this._config = config;

        this._availableExtensions = [
            ...this._config.get('files.availableExtensions.default', []),
            ...this._config.get('files.availableExtensions.assets', []),
            ...this._config.get('files.availableExtensions.images', []),
            ...this._config.get('files.availableExtensions.videos', []),
            ...this._config.get('files.availableExtensions.audio', []),
            ...this._config.get('files.availableExtensions.misc', [])
        ];

        return this;
    }

    /**
     * Checks if URL is absolute.
     *
     * @return {boolean}
     */
    isAbsolute(): boolean {
        return this.host.length > 0;
    }

    /**
     * Checks if URL is local application URL.
     *
     * @return {boolean}
     */
    isAppUrl(): boolean {
        return this.href.indexOf(trimEnd(this._config.get('app.baseUrl'), '/')) === 0;
    }

    /**
     * Get extension if it exists.
     *
     * @return {string|null}
     */
    getExtension(): string | null {
        if (!this.pathname) {
            return null;
        }

        const basename = this.pathname.substr(this.pathname.lastIndexOf('/') + 1);
        const dotIndex = basename.lastIndexOf('.');

        if (dotIndex === -1) {
            return null;
        }

        return basename.substr(dotIndex + 1);
    }

    /**
     * Check if URL is available file.
     *
     * @return {boolean}
     */
    isAvailableFile(): boolean {
        const extension = this.getExtension();

        if (!extension) {
            return false;
        }

        return this._availableExtensions.includes(extension);
    }

    /**
     * Make URL address.
     *
     * @param {string} address
     * @param {Object|null} [params=null]
     *
     * @return {URL}
     */
    make(address: string, params: Object | null = null): URLInterface {
        this.parse(this._compileAddress(address, params));

        return this;
    }

    /**
     * Make application URL address.
     *
     * @param {string} address
     * @param {Object|null} [params=null]
     *
     * @return {URL}
     */
    makeApp(address: string, params: Object | null = null): URLInterface {
        this.make(address, params);
        this._mergeWithBaseUrl();
        this.pathname = this._normalizePathname(this.pathname);

        return this;
    }

    _compileAddress(address: string, params: Object | null): string {
        if (params) {
            const compile = pathToRegexp.compile(address);

            address = compile(params);
        }

        return address;
    }

    _mergeWithBaseUrl(): void {
        const baseUrl = new URLParse(this._config.get('app.baseUrl'));

        this.protocol = baseUrl.protocol;
        this.slashes = baseUrl.slashes;
        this.username = baseUrl.username;
        this.password = baseUrl.password;
        this.host = baseUrl.host;
        this.hostname = baseUrl.hostname;
        this.port = baseUrl.port;
        this.pathname = trimEnd(baseUrl.pathname, '/') + this.pathname;
    }

    /**
     * Normalize route path. Add or delete slash before and after if it necessary.
     *
     * @param {string} pathname
     *
     * @return {string}
     *
     * @private
     */
    _normalizePathname(pathname: string): string {
        if (pathname.indexOf('/') !== 0) {
            pathname = `/${pathname}`;
        }

        if (!this.isAvailableFile()) {
            if (this._config.get('app.trailingSlash') === true) {
                if (pathname.lastIndexOf('/') !== (pathname.length - 1)) {
                    pathname = `${pathname}/`;
                }
            } else if (this._config.get('app.trailingSlash') === false) {
                pathname = trimEnd(pathname, '/');
            }
        }

        return pathname;
    }
}
