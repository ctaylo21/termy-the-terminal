/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./base.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'main.min.js',
  },
  devtool: false,
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: false,
        },
        discardComments: {
          removeAll: true,
        },
      },
      canPrint: true,
    }),
  ],
});
