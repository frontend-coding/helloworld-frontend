const path = require( 'path' )

module.exports = {
  entry: path.resolve( __dirname, 'src/index.js' ),
  devtool: 'source-map',
  output: {
    path: path.resolve( __dirname, 'dist/' ),
    filename: 'index.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader', options: { attrs: { 'data-type': 'app' } } },
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        include: [ path.resolve( __dirname, 'src' ) ],
        use: [ 'babel-loader' ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: `static/img/[name].[ext]`
            }
          }
        ]
      }
    ]
  },
  plugins: [
  ]
}
