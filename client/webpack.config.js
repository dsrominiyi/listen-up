
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
    compress: true,
    inline: true,
    port: 3000
  }
};