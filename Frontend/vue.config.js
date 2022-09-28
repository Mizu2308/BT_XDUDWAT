
module.exports = {
    // config
    configureWebpack:{
        optimization: {
          splitChunks: {
            chunks: 'async',
            minSize: 10000,
            maxSize: 250000,
          }
        }
    },
    pwa: {
        iconPaths: {
           favicon32: './public/favicon2.png',
        }
    },
    devServer: {
        public: process.env.NODE_ENV === 'production'
            ? 'subdomain.domain.ext:port'
            : '/',
        disableHostCheck: true,
    },
    runtimeCompiler: process.env.NODE_ENV !== 'production',
    lintOnSave: false,
    chainWebpack: (config) => {
        config
        .plugin('html')
        .tap((args) => {
            args[0].title = 'TOKYO SAUNA';
            return args;
        });
    },
}