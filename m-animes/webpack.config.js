var path = require('path')
var webpack = require('webpack')

module.exports = {
	devtool:'eval-source-map',
	entry:'./src/main.js',
	output:{
    path: path.resolve(__dirname, './public'),
    publicPath: '/public/',
    filename: 'animes.js'
	},

	module:{
		loaders: [
			{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
			},
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /.css$/,
        loader: 'style-loader!css-loader'
      },
      { 
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
        loader: 'url-loader?limit=50000&name=[path][name].[ext]'
      }
		]
	},
	devServer: {
    historyApiFallback: true,
    noInfo: true
	}
}

// 生产环境
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
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

