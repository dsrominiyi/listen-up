var webpack = require('webpack');

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname,
    filename: 'server.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [ 'env', 'stage-0' ]
        }
      }
    ],
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false
  },
  plugins: [ new webpack.IgnorePlugin(/^vertx$/) ],
  target: 'node',
  stats: {
    colors: true
  },
  devtool: 'source-map'
};