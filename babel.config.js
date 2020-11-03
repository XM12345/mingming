module.exports = {
  presets: [
    [
      '@vue/app',
      { polyfills: ['es6.array.iterator', 'es6.promise', 'es6.object.assign', 'es7.promise.finally', 'es6.symbol'] }
    ]
  ],
  plugins: [
    ['component', { libraryName: 'mint-ui', style: true }],
    ['import', { libraryName: 'vant', libraryDirectory: 'es', style: true }, 'vant'],
    ['@babel/plugin-proposal-optional-chaining']
  ]
};
