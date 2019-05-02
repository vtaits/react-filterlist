const path = require('path');

const context = path.join(__dirname, 'examples');

module.exports = {
  mode: 'development',
  context,
  entry: './index.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/examples/dist/',
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /(\.js)/,
      exclude: /(node_modules|dist)/,
      use: [{
        loader: 'babel-loader',
      }],
    }],
  },
  resolve: {
    alias: {
      '@vtaits/react-filterlist': path.join(__dirname, 'src'),
    },
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },
};
