const appConfig = require('./src/app.config')
const TerserPlugin = require('terser-webpack-plugin');

let optimization = {}
const splitChunks = {}
if (process.env.VUE_APP_ENV === 'production'){
  splitChunks.cacheGroups = {
    vendors: {
      name: 'chunk-vendors',
      test: /node_modules/,
      priority: -10,
      chunks: 'initial',
      minChunks: 1,
      maxInitialRequests: 5,
      minSize: 1024 * 244,
      maxSize: 1024 * 1024 / 2
    },
    common: {
      name: 'chunk-common',
      minChunks: 2,
      priority: -20,
      chunks: 'initial',
      reuseExistingChunk: true,
      maxInitialRequests: 5,
      minSize: 1024 * 244,
      maxSize: 1024 * 1024 / 2
    },
  }
  optimization = {
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        include: /src/,
        test: /\.js(\?.*)?$/i,
        parallel: true
      }),
    ],
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks
  }
}
module.exports = {
  // baseUrl: process.env.VUE_APP_ENV !== 'production' ? './' : '/',
  configureWebpack: {
    name: appConfig.title,
    resolve: {
      alias: require('./aliases.config').webpack
    },
    optimization
  },
  chainWebpack(config) {
    config.plugins.delete('prefetch')
    return config
  },
  css: {
    sourceMap: false,
    extract: true,
    loaderOptions: {},
    modules: false
  },
  productionSourceMap: false,
  devServer: {
    port: 8956,
    ...(process.env.VUE_APP_API
      ? // 代理生产地址.
        {
          proxy: {
            '/api': {
              target: process.env.VUE_APP_API
            }
          }
        }
      : // 代理本地地址.
        {})
    // { before: require('./tests/mock-api') }),
  }
}
