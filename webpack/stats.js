/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const prod = require('./prod.js');

module.exports = merge(prod, {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
});
