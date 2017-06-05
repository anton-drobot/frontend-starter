const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SvgStorePlugin = require('webpack-external-svg-sprite');

// PostCSS, TODO: cssnano, node-css-mqpacker, postcss-sprites, lost
const sassImportOnce = require('node-sass-import-once');
const postcssCalc = require('postcss-calc');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const lost = require('lost');

const env = process.env.NODE_ENV;

module.exports = {
    entry: {
        app: ['babel-polyfill', path.join(__dirname, '/bootstrap/client.js')]
    },
    output: {
        publicPath: '/assets/',
        path: path.join(__dirname, '/static/assets/'),
        filename: 'js/[name].js'
    },
    resolve: {
        modules: [
            __dirname,
            'node_modules'
        ],
        extensions: ['.js']
    },
    target: 'web',
    watch: false,
    bail: false,
    profile: true,
    devtool: env === 'development' ? 'cheap-source-map' : 'source-map',
    node: {
        fs: 'empty'
    },
    stats: {
        assets: false,
        hash: false,
        version: false,
        chunks: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                    /static/
                ],
                loader: 'babel-loader',
                options: {
                    ignore: [
                        'node_modules/**/*'
                    ],
                    presets: [
                        [
                            'es2015',
                            {
                                modules: false
                            }
                        ],
                        'react'
                    ],
                    plugins: [
                        'transform-async-to-generator',
                        'transform-decorators-legacy',
                        'transform-class-properties',
                        'transform-object-rest-spread'
                    ]
                }
            },
            {
                test: /\.scss$/,
                exclude: [
                    /node_modules/,
                    /static/
                ],
                // TODO: какие нужны соурсмапы
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        lost,
                                        postcssCalc,
                                        postcssFlexbugsFixes,
                                        autoprefixer
                                        //cssnano
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                importer: sassImportOnce,
                                importOnce: {
                                    index: true
                                },
                                includePaths: [
                                    path.resolve(__dirname)
                                ]
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.ContextReplacementPlugin(/app[\/\\]modules/, false),
        new SvgStorePlugin({
            directory: path.resolve(__dirname, 'app', 'modules'),
            name: 'images/sprite.svg',
            prefix: 'icon-',
        }),
        new ExtractTextPlugin('css/app.css')
        /*new UglifyJSPlugin({
            compress: {
                warnings: false
            },
            beautify: env === 'development',
            comments: env === 'development'
        })*/
    ]
};

