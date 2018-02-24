export interface LocationInterface {
    /**
     * The full URL.
     */
    href: string;

    /**
     * The origin of the URL.
     */
    origin: string;

    /**
     * The protocol scheme of the URL (e.g. "http:").
     */
    protocol: string;

    /**
     * Username of basic authentication.
     */
    username: string;

    /**
     * Password of basic authentication.
     */
    password: string;

    /**
     * Host name with port number.
     */
    host: string;

    /**
     * Host name without port number.
     */
    hostname: string;

    /**
     * Optional port number.
     */
    port: ?number;

    /**
     * URL path.
     */
    pathname: string;

    /**
     * The "query string" including the question sign ("?").
     */
    search: string;

    /**
     * The parsed "query string" into object.
     */
    query: Object;

    /**
     * The "fragment" portion of the URL including the pound-sign ("#").
     */
    hash: string;


    /**
     * Generates a full URL.
     *
     * @return {string}
     */
    toString(): string
}
