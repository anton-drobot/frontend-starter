const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SvgStorePlugin = require('webpack-external-svg-sprite');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

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
    entry: {
        app: path.join(__dirname, 'bootstrap', 'client', 'index.js')
    },
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
    mode: isDev ? 'development' : 'production',
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
                use: [
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
                                ],
                                'react-loadable/babel'
                            ]
                        }
                    }
                ]
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
                use: [
                    MiniCssExtractPlugin.loader,
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
            }
        ]
    },
    plugins: (function () {
        const plugins = [
            new webpack.ContextReplacementPlugin(/app[/\\]modules/, false),
            new SvgStorePlugin({
                directory: path.resolve(__dirname, 'app', 'images'),
                name: 'images/sprite.svg',
                prefix: 'icon-',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].chunk.css'
            }),
            new ReactLoadablePlugin({
                filename: path.join('build', 'react-loadable.json')
            })
        ];

        if (isDev) {
            plugins.push(
                new WriteFilePlugin({
                    test: /react-loadable\.json$/
                })
            );
        }

        return plugins;
    })(),
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: {
            name: 'manifest',
        },
        minimizer: (function () {
            const plugins = [
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

            if (!isDev) {
                plugins.push(
                    new UglifyJSPlugin({
                        cache: true,
                        parallel: true,
                        uglifyOptions: {
                            ecma: 5,
                            output: {
                                comments: false,
                                beautify: false
                            }
                        }
                    }),
                );
            }

            return plugins;
        })()
    }
};
