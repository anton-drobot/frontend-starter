import { allExtensions } from '../fileDefinitions';

describe('fileDefinitions', () => {
    test('allExtensions', () => {
        expect(allExtensions()).toEqual([
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
            'zip',
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
            'scss',
            'jpg',
            'jpeg',
            'bmp',
            'png',
            'gif',
            'svg',
            'webp',
            'mp4',
            'avi',
            'mov',
            'mpg',
            'mpeg',
            'mkv',
            'webm',
            'mp3',
            'wav',
            'wma',
            'm4a',
            'ogg'
        ]);
    });
});