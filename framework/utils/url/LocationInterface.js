export interface LocationInterface {
    /**
     * The protocol scheme of the URL (e.g. "http:").
     */
    protocol: string,

    /**
     * A boolean which indicates whether the protocol is followed by two forward slashes ("//").
     */
    slashes: boolean,

    /**
     * Authentication information portion (e.g. "username:password").
     */
    auth: string,

    /**
     * Username of basic authentication.
     */
    username: string,

    /**
     * Password of basic authentication.
     */
    password: string,

    /**
     * Host name with port number.
     */
    host: string,

    /**
     * Host name without port number.
     */
    hostname: string,

    /**
     * Optional port number.
     */
    port: string,

    /**
     * URL path.
     */
    pathname: string,

    /**
     * Parsed object containing query string, unless parsing is set to false.
     */
    query: Object | boolean,

    /**
     * The "fragment" portion of the URL including the pound-sign ("#").
     */
    hash: string,

    /**
     * The full URL.
     */
    href: string,

    /**
     * The origin of the URL.
     */
    origin: string,

    /**
     * Change parts of the URL.
     *
     * @param {string} part - Part to change.
     * @param {string|Object} value - New value to set. Object only for "query" part.
     */
    set(part: string, value: string | Object): void,

    /**
     * Generates a full URL.
     *
     * @param {Function?} stringify - Function which will stringify the query string.
     *
     * @return {string}
     */
    toString(stringify?: (Object) => string): string,
}
