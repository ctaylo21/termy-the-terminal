/* eslint @typescript-eslint/no-var-requires: 0 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

module.exports = (env, argv) => ({
  mode: 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'inline-source-map',
  entry: path.resolve(__dirname, 'src/index.tsx'),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.(s*)css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: 'svg-react-loader',
        },
      },
    ],
  },
  output: {
    filename: 'Terminal.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'Terminal.css',
    }),
    argv.analyze ? new BundleAnalyzerPlugin() : () => {},
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  externals: {
    react: 'commonjs react',
  },
});
