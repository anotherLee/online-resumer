
module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015'},
      {test:/\.css$/,loader:'style-loader!css-loader'},
      {test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/, loader: 'file-loader'},
      {test: /\.scss$/, exclude: /node_modules/, loader: 'style-loader!css-loader!sass-loader' }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}