/**
 * Converts the first character of string to lower case.
 *
 * @param {String} string
 *
 * @return {String}
 */
export function lowerFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
