module.exports = (api) => {
    return api.env('test')
        ? {
              presets: [
                  [
                      '@babel/preset-env',
                      { targets: { esmodules: true, node: 'current' } },
                  ],
                  '@babel/preset-typescript',
              ],
          }
        : {
              plugins: [
                  [
                      'module-resolver',
                      {
                          alias: {
                              '@': './src',
                          },
                      },
                  ],
              ],
              presets: [
                  [
                      '@babel/preset-env',
                      { targets: { esmodules: true, node: 'current' } },
                  ],
                  '@babel/preset-typescript',
              ],
              exclude: /node_modules\/?!(pkg-up)/,
          }
}
