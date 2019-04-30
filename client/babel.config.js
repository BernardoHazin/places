module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry'
      }
    ]
  ],
  plugins:
    process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : []
}
