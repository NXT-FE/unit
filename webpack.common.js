const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const tsImportPluginFactory = require('ts-import-plugin');
module.exports = {
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        chunkFilename: "components/[name].cp.js",
        publicPath: "/"
    },
    context: __dirname,
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
            component: path.resolve(__dirname, "src/component/"),
            interface: path.resolve(__dirname, "src/interface/"),
            library: path.resolve(__dirname, "src/library/"),
            static: path.resolve(__dirname, "src/static/"),
            style: path.resolve(__dirname, "src/style/"),
            template: path.resolve(__dirname, "src/template/"),
            theme: path.resolve(__dirname, "src/theme/")
        }
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            include: [path.resolve(__dirname, "src")],
            use: [
                {
                    loader: "babel-loader?cacheDirectory=true",
                    options: {
                        presets: [
                            "es2015",
                            "react",
                            [
                                "env",
                                {
                                    targets: {
                                        browsers: [
                                            "> 1%",
                                            "IE 10",
                                            "not ie <= 8"
                                        ]
                                    }
                                }
                            ]
                        ],
                        plugins: [
                            "transform-runtime",
                            "transform-class-properties",
                            require("babel-plugin-transform-object-rest-spread"),
                            "syntax-dynamic-import",
                            [
                                "import",
                                {
                                    libraryName: "antd",
                                    // libraryDirectory: "es",
                                    style: "css"
                                }
                            ]
                        ]
                    }
                }
            ]
        },
        {
            test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/,
            options: {
                getCustomTransformers: () => ({
                    before: [tsImportPluginFactory({
                        libraryName: "antd",
                        libraryDirectory: "es",
                        style: "css"
                    })]
                })
            },
        },
        {
            test: /\.scss$/,
            include: path.resolve(__dirname, "src/style"),
            use: [{
                loader: "style-loader",
                options: {
                    transform: "./src/theme/transform.js"
                }
            },
            {
                loader: "css-loader",
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: "[name]_[local]-[hash:base64:5]"
                }
            },
            {
                loader: "sass-loader"
            }
            ]
        },
        {
            test: /\.use(able)?\.scss$/,
            exclude: path.resolve(__dirname, "src/style"),
            use: [{
                loader: "style-loader/useable",
                options: {
                    insertInto: "body"
                }
            },
            {
                loader: "css-loader",
                options: {
                    // root:'http://192.168.3.76:9988/' modules: true, localIdentName:
                    // "[name]_[local]-[hash:base64:5]"
                }
            },
            {
                loader: "sass-loader"
            }
            ]
        },
        {
            test: /\.(png|svg|jpe?g|gif)$/,
            use: [{
                loader: "file-loader",
                options: {
                    name: "[name].[hash:6].[ext]",
                    outputPath: "images/"
                    // publicPath:"http://192.168.3.76:9988/"
                }
            }]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [{
                loader: "file-loader"
            }]
        },
        {
            test: /\.MP3|wav/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "static/[name].[ext]"
                }
            }]
        },
        {
            test: /.html$/,
            use: [{
                loader: "html-loader",
                options: {
                    minimize: true
                }
            }]
        },
        {
            test: /\.handlebars$/,
            loader: "handlebars-loader?helperDirs[]=" +
                __dirname +
                "/src/plugins/helper"
        },
        {
            test: /\.(csv|tsv)$/,
            loader: "csv-loader"
        },
        {
            test: /\.xml$/,
            loader: "xml-loader"
        }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new HtmlWebpackPlugin({
            filename: `index.html`,
            template: "src/index.html",
            inject: true,
            chunks: ["mainfest", "vendors", "commons", "index"],
            minify: {
                removeComments: true,
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        }),
        new webpack.ProvidePlugin({
            Axios: "axios",
            React: "react",
            ReactDOM: "react-dom",
            Component: ["react", "Component"],
            Style: path.resolve(__dirname, "src/style/style.scss"),
            __HTTP_JSON__: path.resolve(__dirname, "./http.json"),
            __EFOS_STORE__: path.resolve(__dirname, "./efos_store")
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    minSize: 30000,
                    chunks: "all"
                },
                commons: {
                    name: "commons",
                    chunks: "all", //initial
                    minChunks: 2
                }
            }
        },
        runtimeChunk: {
            name: "mainfest" //entrypoint => `runtimechunk~${entrypoint.name}`
        }
    }
};