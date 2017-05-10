/**
 * File definitions helper.
 * Contains file extensions for common use cases.
 */
class FileDefinitions {

    /**
     * Entry point to request a definition set.
     *
     * @param {String} type
     *
     * @return {Array}
     */
    get(type) {
        return this.getDefinitions(type);
    }

    /**
     * Returns a definition set from config or from the default sets.
     *
     * @param {String} type
     *
     * @return {Array}
     */
    getDefinitions(type) {
        if (!this[`${type}Extensions`]) {
            throw new Error(`No such definition set exists for "${type}"'`);
        }

        return this[`${type}Extensions`]();
    }

    /**
     * All extensions.
     *
     * @return {Array}
     */
    allExtensions() {
        return [
            ...this.defaultExtensions(),
            ...this.assetExtensions(),
            ...this.imageExtensions(),
            ...this.videoExtensions(),
            ...this.audioExtensions()
        ]
    }

    /**
     * Extensions that are particularly benign.
     *
     * @return {Array}
     */
    defaultExtensions() {
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
    assetExtensions() {
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
    imageExtensions() {
        return [
            'jpg',
            'jpeg',
            'bmp',
            'png',
            'gif',
            'svg'
        ];
    }

    /**
     * Extensions typically used as video files.
     *
     * @return {Array}
     */
    videoExtensions() {
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
    audioExtensions() {
        return [
            'mp3',
            'wav',
            'wma',
            'm4a',
            'ogg'
        ];
    }
}

export default new FileDefinitions();
