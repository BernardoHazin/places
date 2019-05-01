module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry'
      }
    ]
  ],
  /* Remove console logs */
  plugins:
    process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : []
}
