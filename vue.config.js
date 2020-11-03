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
    hotOnly: true
    /*  proxy: {
      '/api': {
        target: 'http://127.0.0.1:8090',
        changeOrigin: true
      }
    } */
  }
};
let hybridBuildConfig = {
  publicPath: './',
  outputDir: `hybrid_APP/dist/hybrid_app_${version}`,
  productionSourceMap: false,
  css: {
    // 强制内联
    extract: false
  },
  configureWebpack: {
    resolve: configureWebpackResolve,
    output: {
      filename: '[name].js',
      chunkFilename: 'common.[name].js'
    },
    optimization: {
      splitChunks: false
    }
  },
  chainWebpack: config => {
    // 禁止js预加载
    config.plugins.delete('prefetch');
    config.plugins.delete('prefetch-contentBody');
    config.plugins.delete('preload');
    config.plugins.delete('preload-contentBody');

    config.plugin('html-contentBody').tap(args => {
      args[0].minify = false;
      return args;
    });

    config.module
      .rule('images')
      .use('url-loader')
      .tap(options =>
        Object.assign({}, options, {
          name: '[name].[ext]',
          limit: 40960,
          fallback: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        })
      );
  },
  pages: {
    contentBody: {
      entry: 'hybrid_app/src/pages/contentBody/main.js',
      template: 'hybrid_app/src/pages/contentBody/index.html',
      filename: 'contentBody.html'

      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      // title: 'Index Page',

      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ['chunk-vendors', 'chunk-common', 'cmsContentBody']
    }
  }
};

let rawArgv = process.argv.slice(2);
let args = require('minimist')(rawArgv, { string: ['config'] });
let modName = '';

if (args.config == 'hybrid') {
  modName = '混合APP 内嵌页面模式';
  module.exports = hybridBuildConfig;
} else {
  modName = '普通模式';
  module.exports = siteBuildConfig;
}
process.title = modName;
console.log(`${chalk.yellowBright.bold(modName)}.`);
