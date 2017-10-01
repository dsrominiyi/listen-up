
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/public/app',
    publicPath: '/app/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [ 'env', 'react', 'stage-0' ]
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader?sourceMap',
        exclude: /node_modules/
      }
    ],
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname + '/public',
    publicPath: '/app/',
    historyApiFallback: true,
    compress: true,
    inline: true,
    port: 3000
  }
};