const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  target: 'web',
  context: `${__dirname}/src`,
  entry: {
    background: './background',
    'content-script': './content-script'
  },
  output: {
    path: `${__dirname}/app/`,
    filename: '[name].js',
    publicPath: '../'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(jpg|gif|png|woff|woff2|eot|ttf)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'manifest.json',
        transform: function(content) {
          return Buffer.from(
            JSON.stringify({
              ...JSON.parse(content.toString()),
              name: process.env.npm_package_productName,
              description: process.env.npm_package_description,
              version: process.env.npm_package_version
            })
          )
        }
      }
    ])
  ],
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '~~': `${__dirname}/`,
      '~': `${__dirname}/src/`
    }
  }
}
