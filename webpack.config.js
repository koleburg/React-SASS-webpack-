const path = require("path");
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = (env, argv) =>  {
    return {
        cache: false,
        output: {
            path: path.join(__dirname, "/build"),
            filename: "./js/bundle.js",
            crossOriginLoading: 'anonymous',
        },
        devServer: {
            hot: true,
            historyApiFallback: true,
            host: '192.168.1.11',
            port: 8080,
            inline: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.(bmp|gif|jpe?g|png|svg)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        name: 'img/[name].[ext]',
                    },
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
                },
                {
                    test: /\.sass$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            {
                                loader: "postcss-loader",
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
                            'sass-loader'
                        ]
                    })
                }
            ]
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({}),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html",
                minify: {
                    removeComments: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                }
            }),
            new ExtractTextPlugin({
                filename: "styles.css",
                disable: argv.mode === "production" ? false : true
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    }
};
