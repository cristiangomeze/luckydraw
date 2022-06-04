module.exports = {
    pluginOptions: {
      electronBuilder: {
        nodeIntegration: true,
        builderOptions: {
          productName: 'LuckyDraw',
          publish: ['github'],
          win: {
            target: ['nsis']
          },
          appId: "com.electron.luckydraw",
        }
      }
    }
}