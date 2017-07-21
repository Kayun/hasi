const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReloadPlugin = require('reload-html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

const axis = require('axis');
const rupture = require('rupture');

const SRC_DIR = path.resolve(__dirname, 'src');
const IS_PROD = process.env.NODE_ENV === 'production'

let templates = () => {
  let templatesPath = `${SRC_DIR}/templates/pages`;
  let files = fs.readdirSync(templatesPath);

  return files.map(file => {
    return new HtmlWebpackPlugin({
      filename: `${path.basename(file, '.pug')}.html`,
      template: `${templatesPath}/${file}`
    })
  })
};

module.exports = {
  context: SRC_DIR,
  entry: [
    './styles/index.styl',
    './scripts/index.js'
  ],
  output: {
    filename: 'assets/[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  resolve: {
    extensions: [ '.js', '.styl', '.pug' ],
    modules: [
      'node_modules',
      'spritesmith-generated',
      path.resolve(__dirname, 'src')
    ]
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: (IS_PROD ? [] : ['css-hot-loader']).concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins() {
                  return [
                    require('autoprefixer')
                  ]
                }
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: [rupture(), axis()]
              }
            }
          ]
        }))
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader'
        }
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["env", {
                "targets": {
                  "browsers": ["last 2 versions", "Explorer >= 10"]
                }
              }]
            ]
          }
        }
      }
    ]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(['public']),
    new ManifestPlugin({
      publicPath: '/public/',
      fileName: './assets.json',
      writeToFileEmit: true
    }),
    new ExtractTextPlugin('assets/styles/common.css'),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, 'src/images/sprite'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, 'public/assets/images/sprite.png'),
        css: path.resolve(__dirname, 'src/styles/helpers/sprite.styl')
      },
      apiOptions: {
        cssImageRef: "/assets/images/sprite.png"
      }

    })
  ].concat(templates()).concat(
    IS_PROD ? [
    ] : [
      new webpack.HotModuleReplacementPlugin(),
      new ReloadPlugin()
    ]
  ),

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 3000,
    hot: true
  }
};

