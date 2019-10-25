const path = require('path')
module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
  configureWebpack: config => {
    // Configuration applied to all builds
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      //option: default, // description
      disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
      mainProcessTypeChecking: false, // Manually enable type checking during webpck bundling for background file.
      chainWebpackMainProcess: config => {
        //主进程webpack配置
      },
      chainWebpackRendererProcess: config => {
        //渲染进程webpack配置
      },
      builderOptions: {
        publish: [
          {
            provider: 'generic',
            url: 'http://127.0.0.1/'//版本更新地址
          }
        ]
      }
    }
  }
}

//全局CSS变量
function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/css/color.less'), // 需要全局导入的less
      ],
    })
}
