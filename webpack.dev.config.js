const path = require('path');
const webpack = require('webpack');


module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: [
      '@babel/polyfill',
      './index.js',
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './build/js'),
  },
  module: {
    rules: [
      
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.css$/,
        use:  [  
          'style-loader', 
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          'postcss-loader',
        ],
      },
    
    ],
  }
};