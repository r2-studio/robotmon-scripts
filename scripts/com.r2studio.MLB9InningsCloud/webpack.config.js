const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  target: 'es5',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    chunkFormat: 'array-push',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimize: true,
    usedExports: false, // <- no remove unused function
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {
            passes: 2,
            dead_code: false,
            drop_console: false,
            unused: false,
            keep_fnames: true,
          },
          mangle: {
            properties: false,
            reserved: ['stop', 'start', 'window'], // keep them otherwise script failed bc notFound
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map[query]',
    }),
  ],
};
