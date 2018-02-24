// @flow

export interface URLInterface {
    constructor(config: Object, address: string): URLInterface;

    /**
     * Make URL address.
     *
     * @param {string} address
     * @param {Object|null} params
     *
     * @return {URL}
     */
    make(address: string, params: Object | null): URLInterface;

    /**
     * Make application URL address.
     *
     * @param {string} address
     * @param {Object|null} params
     *
     * @return {URL}
     */
    makeApp(address: string, params: Object | null): URLInterface;

    /**
     * Checks if URL is absolute.
     *
     * @return {boolean}
     */
    isAbsolute(): boolean;

    /**
     * Checks if URL is local application URL.
     *
     * @return {boolean}
     */
    isAppUrl(): boolean;

    /**
     * Get extension if it exists.
     *
     * @return {string|null}
     */
    getExtension(): string | null;

    /**
     * Check if URL is available file.
     *
     * @return {boolean}
     */
    isAvailableFile(): boolean;
}
