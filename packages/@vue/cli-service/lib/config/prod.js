module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    if (process.env.NODE_ENV === 'production') {
      const getAssetPath = require('../util/getAssetPath')
      const filename = getAssetPath(
        options,
        `js/[name].[chunkhash:8].js`,
        true /* placeAtRootIfRelative */
      )

      webpackConfig
        .mode('production')
        .devtool('source-map')
        .output
          .filename(filename)
          .chunkFilename(filename)

      // keep module.id stable when vendor modules does not change
      webpackConfig
        .plugin('hash-module-ids')
          .use(require('webpack/lib/HashedModuleIdsPlugin'))

      // disable optimization during tests to speed things up
      if (process.env.VUE_CLI_TEST) {
        webpackConfig.optimization.minimize(false)
      } else {
        const UglifyPlugin = require('uglifyjs-webpack-plugin')
        const uglifyOptions = require('./uglifyOptions')
        webpackConfig.optimization.minimizer([
          new UglifyPlugin(uglifyOptions(options))
        ])
      }
    }
  })
}
