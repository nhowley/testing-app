const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');

module.exports = {
  watch: true,
  entry: ['babel-polyfill', './src/index.js'],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {presets: ['@babel/env']}
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
        },
      }
    ]
  },
  resolve: {extensions: [
    '.js',
    '.jsx'
  ]},
  output: {
    path: path.resolve(__dirname, '../public/js'),
    publicPath: '/public/js/',
    filename: 'login-bundle.js'
  },
  devServer: {
    port: 3031,

  },
  plugins: [new Dotenv()]
}