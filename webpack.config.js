const path = require('path');

module.exports = {
    entry: {
        "glsl-proj4": [path.resolve(__dirname, 'src/index.js')],
		    "example": [path.resolve(__dirname, 'example/gl.js')],
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, "dist"),
    },
	  devServer: {
	    publicPath: '/dist/'
	  },
  module: {
		rules: [{
			test: /\.(glsl|frag|vert)$/,
			exclude: /node_modules/,
			loader: 'raw-loader'
		}]
  }
};
