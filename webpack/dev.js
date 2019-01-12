/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const common = require('./base.js');

module.exports = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Termy',
      template: path.resolve(__dirname, '../src/templates/index.html'),
    }),
    new webpack.NamedModulesPlugin(),
  ],
});
