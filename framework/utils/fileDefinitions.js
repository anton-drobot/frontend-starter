// @flow

/**
 * All extensions.
 *
 * @return {string[]}
 */
export function allExtensions(): string[] {
    return [
        ...defaultExtensions(),
        ...assetExtensions(),
        ...imageExtensions(),
        ...videoExtensions(),
        ...audioExtensions()
    ];
}

/**
 * Extensions that are particularly benign.
 *
 * @return {string[]}
 */
export function defaultExtensions(): string[] {
    return [
        'jpg',
        'jpeg',
        'bmp',
        'png',
        'gif',
        'svg',
        'js',
        'map',
        'ico',
        'css',
        'less',
        'scss',
        'pdf',
        'swf',
        'txt',
        'xml',
        'xls',
        'eot',
        'woff',
        'woff2',
        'ttf',
        'flv',
        'wmv',
        'mp3',
        'ogg',
        'wav',
        'avi',
        'mov',
        'mp4',
        'mpeg',
        'webm',
        'mkv',
        'rar',
        'zip'
    ];
}

/**
 * Extensions seen as assets.
 *
 * @return {string[]}
 */
export function assetExtensions(): string[] {
    return [
        'jpg',
        'jpeg',
        'bmp',
        'png',
        'gif',
        'ico',
        'css',
        'js',
        'woff',
        'svg',
        'ttf',
        'eot',
        'json',
        'md',
        'less',
        'sass',
        'scss'
    ];
}

/**
 * Extensions typically used as images.
 *
 * @return {string[]}
 */
export function imageExtensions(): string[] {
    return [
        'jpg',
        'jpeg',
        'bmp',
        'png',
        'gif',
        'svg',
        'webp'
    ];
}

/**
 * Extensions typically used as video files.
 *
 * @return {string[]}
 */
export function videoExtensions(): string[] {
    return [
        'mp4',
        'avi',
        'mov',
        'mpg',
        'mpeg',
        'mkv',
        'webm'
    ];
}

/**
 * Extensions typically used as audio files.
 *
 * @return {string[]}
 */
export function audioExtensions(): string[] {
    return [
        'mp3',
        'wav',
        'wma',
        'm4a',
        'ogg'
    ];
}
