/**
 * All extensions.
 *
 * @return {Array}
 */
export function allExtensions() {
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
 * @return {Array}
 */
export function defaultExtensions() {
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
 * @return {Array}
 */
export function assetExtensions() {
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
 * @return {Array}
 */
export function imageExtensions() {
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
 * @return {Array}
 */
export function videoExtensions() {
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
 * @return {Array}
 */
export function audioExtensions() {
    return [
        'mp3',
        'wav',
        'wma',
        'm4a',
        'ogg'
    ];
}
