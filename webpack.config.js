const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dotenv = require('dotenv');

const buildPlugins = () => {
  const plugins = [];
  if (process.env.NODE_ENV !== 'production') {
    const devEnvVariable = new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    });
    plugins.push(devEnvVariable);
  }
  plugins.push(new webpack.ProvidePlugin({ react: 'react' }));
  plugins.push(new ExtractTextPlugin('styles.css'));
  const dotEnvVars = dotenv.config();
  const defines = Object.keys(dotEnvVars)
    .reduce((memo, key) => {
      const val = JSON.stringify(dotEnvVars[key]);
      memo[`__${key.toUpperCase()}__`] = val;
      return memo;
    }, {});
  plugins.push(new webpack.DefinePlugin(defines));
  return plugins;
};

module.exports = {
  // entry point needs to be entry.jsx
  entry: './client/entry.jsx',
  // webpack output to client/dist/bundle.js
  output: {
    path: './server/static',
    publicPath: './server/static',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        // regular expression for .jsx or .js
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2'],
        },
      },
      {
        test: /\.sass$|\.css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css!sass'
        ),
      },
    ],
  },
  resolve: {
    alias: {
      // specific to pageXSubscribed series
      // actions: `${__dirname}/client/actions/actionCreators.js`,
    },
  },
  extensions: ['', '.js', '.jsx'],
  sassLoader: {
    includePaths: ['./client/styles'],
  },
  plugins: buildPlugins(),
};