const eslintPluginHuoli = {
  rules: {
    'no-location-jump': require('./lib/rules/no-location-jump'),
  },
  configs: {
    recommended: {
      plugins: ['huoli'],
      rules: {
        'huoli/no-location-jump': 'error'
      }
    }
  }
}

module.exports = {
  ...eslintPluginHuoli,
}
