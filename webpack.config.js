const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin'); // 用于代码压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理输出目录
const webpackNodeExternals = require('webpack-node-externals'); // 排除Node.js的内置模块和第三方模块

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  externals: [webpackNodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};