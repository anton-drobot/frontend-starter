// CommonJS because this file exports to webpack config.

module.exports = {
    baseUrl: 'http://localhost:3000/', // This is used in the webpack configuration file
    trailingSlash: true, // true - add trailing slash, false - delete trailing slash, null - never mind
    locale: 'ru'
};
