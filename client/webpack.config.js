
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
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'sourcemap',
  devServer: {
    contentBase: __dirname + '/public',
    publicPath: '/app/',
    compress: true,
    inline: true,
    port: 3000
  }
};