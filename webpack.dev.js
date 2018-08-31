const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
var hotMiddlewareScript = "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&overlayWarnings=true";

module.exports = merge(common, {
  entry: {
    index: ["babel-polyfill", "./src/index.js", hotMiddlewareScript]
  },
  mode: "development",
  cache: true,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css/, loader: 'style-loader!css-loader'
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.scss$/,
        exclude: [/\.use(able)?\.scss/, path.resolve(__dirname, 'src/style')],
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {}
          }, {
            loader: "sass-loader"
          }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  optimization: {
    namedModules: true
  }
})