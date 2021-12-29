let chalk = require('chalk');
let path = require('path');
let date = new Date();
let major = 3;
let minor = date.getFullYear() % 100;
let patch = pad(date.getMonth() + 1) + pad(date.getDate());
let state = ((((date / 1000 + 28800) % 86400) / 66.7) | 0).toString(36);
let version = `${major}.${minor}.${patch}-${state}`;

process.env.VUE_APP_VERSION = version;

function pad(input) {
  return (input + '').padStart(2, '0');
}
function resolve(dir) {
  return path.join(__dirname, dir);
}
const configureWebpackResolve = {
  extensions: ['.js', '.vue', '.json'],
  alias: {
    '@': resolve('./src')
  }
};

let siteBuildConfig = {
  publicPath: './',
  outputDir: `dist`,
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,

  configureWebpack: {
    resolve: configureWebpackResolve,
    output: {
      // pathinfo: false,
      filename: `static/js/[name]--${version}.js`,
      chunkFilename: `static/js/[name].js`
    },
    optimization: {
      splitChunks: false
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].minify = false;
      return args;
    });
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 512;
        return options;
      });
  },

  devServer: {
    hotOnly: true
  }
};

modName = '普通模式';
module.exports = siteBuildConfig;
process.title = modName;
console.log(`${chalk.yellowBright.bold(modName)}.`);
