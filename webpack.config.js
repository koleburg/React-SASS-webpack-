const path = require('path');
const argv = require('yargs').argv;
const autoprefixer = require('autoprefixer');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;

module.exports = {
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'media/img/[name].[ext]',
                        },
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: path.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                        },
                    },
                    {
                        test: /\.(s*)ass$/,
                        exclude: /node_modules/,
                        use: [
                            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    minimize: isProduction
                                }
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                            {
                                loader: require.resolve('sass-loader'),
                            },
                        ]
                    },
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'static/media/[name].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
    ]
};