const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReloadPlugin = require('reload-html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const axis = require('axis');
const rupture = require('rupture');

const SRC_DIR = path.resolve(__dirname, 'src');
const PUBLIC_PATH = '/';
const IS_PROD = process.env.NODE_ENV === 'production'

let hashInclude = (hasName, sufix = '') => IS_PROD ? `.[${hasName}:20]${sufix}` : ''

let templates = () => {
  const TEMPLATE_DIRS = [''];

  return TEMPLATE_DIRS.reduce((array, dir) => {

    let templatesPath = `${SRC_DIR}/templates/pages/${dir}`;

    if (!fs.existsSync(templatesPath)) return array;

    let files = fs.readdirSync(templatesPath).filter(file => file.indexOf('.pug') !== -1);
    let plugins = files.map(file => new HtmlWebpackPlugin({
      filename: `${path.basename(file, '.pug')}.html`,
      template: `${templatesPath}/${file}`,
      inject: false
    }))

    return array.concat(plugins);
  }, []);
};

module.exports = {
  context: SRC_DIR,
  entry: {
    mobile: ['./scripts/mobile.js', './styles/mobile.styl'],
    common: ['./scripts/index.js', './styles/index.styl']
  },
  output: {
    filename: `assets/scripts/[name]${hashInclude('hash', '.min')}.js`,
    path: path.resolve(__dirname, 'public'),
    publicPath: PUBLIC_PATH
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
                minimize: IS_PROD,
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
          loader: `pug-loader?root=${SRC_DIR}/templates/`
        }
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        use: {
          loader: `file-loader?name=assets/images/[name]${hashInclude('hash')}.[ext]`
        }
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: `file-loader?name=assets/fonts/[name].[ext]`
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
    new ExtractTextPlugin(`assets/styles/[name]${hashInclude('contenthash', '.min')}.css`),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, 'src/images/sprite'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, `public/assets/images/sprite${hashInclude('hash')}.png`),
        css: path.resolve(__dirname, 'src/styles/helpers/sprite.styl')
      },
      apiOptions: {
        cssImageRef: `${PUBLIC_PATH}assets/images/sprite${hashInclude('hash')}.png`
      },
      spritesmithOptions: {
        padding: 6
      }

    })
  ].concat(templates()).concat(
    IS_PROD ? [
      new UglifyJSPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      })
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

