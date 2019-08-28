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

module.exports = {
  publicPath: './',
  outputDir: `dist`,
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: true,

  configureWebpack: {
    resolve: configureWebpackResolve,
    output: {
      // pathinfo: false,
      filename: `static/js/[name]--${version}--[hash:6].js`,
      chunkFilename: `static/js/[name]--[chunkhash:6].js`
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].minify = false;
      return args;
    });
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
    hotOnly: true,
   /*  proxy: {
      '/api': {
        target: 'http://127.0.0.1:8090',
        changeOrigin: true
      }
    } */
  }
};
