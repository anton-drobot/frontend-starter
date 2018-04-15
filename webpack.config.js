const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SvgStorePlugin = require('webpack-external-svg-sprite');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// PostCSS, TODO: node-css-mqpacker, postcss-sprites
const sassImportOnce = require('node-sass-import-once');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const env = process.env.NODE_ENV;
const isDev = env === 'development';

const browsers = [
    '> 1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie <= 10',
    'not bb <= 10'
];

module.exports = {
    entry: (function () {
        const entry = {
            app: path.join(__dirname, 'bootstrap', 'client', 'index.js')
        };

        if (isDev) {
            //entry.app.unshift('webpack-hot-middleware/client?path=__webpack_hmr&timeout=20000&dynamicPublicPath=true', 'react-hot-loader/patch');
        }

        return entry;
    })(),
    output: {
        publicPath: '/assets/',
        path: path.join(__dirname, 'static', 'assets'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].chunk.js'
    },
    resolve: {
        modules: [
            __dirname,
            'node_modules'
        ],
        extensions: ['.js']
    },
    watch: false,
    bail: false,
    profile: true,
    devtool: isDev ? 'cheap-source-map' : 'source-map',
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
                use: (function () {
                    const loaders = [
                        {
                            loader: 'babel-loader',
                            options: {
                                babelrc: false,
                                presets: [
                                    [
                                        'env',
                                        {
                                            targets: { browsers },
                                            modules: false,
                                            useBuiltIns: true,
                                            exclude: [
                                                'transform-exponentiation-operator',
                                            ]
                                        }
                                    ],
                                    'flow',
                                    'react'
                                ],
                                plugins: [
                                    'syntax-dynamic-import',
                                    'transform-decorators-legacy',
                                    'transform-class-properties',
                                    'transform-object-rest-spread',
                                    [
                                        'transform-runtime',
                                        {
                                            'helpers': false,
                                            'polyfill': false,
                                            'regenerator': true
                                        }
                                    ]
                                ]
                            }
                        }
                    ];

                    if (isDev) {
                        //loaders.unshift('react-hot-loader/webpack');
                    }

                    return loaders;
                })()
            },
            {
                test: /app\/modules\/(.*)\/components\/(.*)\/index\.js$/,
                loader: 'dependency-loader',
                options: {
                    injections: [
                        'index.scss'
                    ]
                }
            },
            {
                test: /\.scss$/,
                exclude: [
                    /node_modules/,
                    /static/
                ],
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
                                plugins: [
                                    postcssFlexbugsFixes(),
                                    autoprefixer({ browsers })
                                ]
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
    plugins: (function () {
        const plugins = [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            }),
            new webpack.ContextReplacementPlugin(/app[/\\]modules/, false),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function(module) {
                    return module.resource && /node_modules/.test(module.resource);
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            }),
            new SvgStorePlugin({
                directory: path.resolve(__dirname, 'app', 'images'),
                name: 'images/sprite.svg',
                prefix: 'icon-',
            }),
            new ExtractTextPlugin({
                filename: 'css/app.css',
                allChunks: true
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    autoprefixer: false,
                    svgo: false,
                    //discardComments: !isDev,
                    //normalizeWhitespace: !isDev
                },
                canPrint: true
            })
        ];

        if (isDev) {
            //plugins.push(new webpack.HotModuleReplacementPlugin());
        } else {
            plugins.push(new UglifyJSPlugin({
                uglifyOptions: {
                    ecma: 5,
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            }));
        }

        return plugins;
    })()
};

