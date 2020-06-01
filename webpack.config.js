const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:4].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    hot: true,
    port: 8080,
    open: true
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('public/index.html'),
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      }
    })
  ]
}