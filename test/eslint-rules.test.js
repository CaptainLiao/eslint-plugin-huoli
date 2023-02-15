const rule = require('../src/lib/rules/no-location-jump')

const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: 'module' } })
ruleTester.run('huoli/no-location-jump', rule, {
  valid: [
    {
      code: 'winLoca = window.location;',
    }
  ],
  invalid: [
    {
      code: 'var a = 1; location.href = 123;',
      output: `import { navigateTo } from '@/lib/navigate'\r\nvar a = 1; navigateTo(123);`,
      errors: 2
    },
    {
      code: 'location.replace(123);',
      output: `import { redirectTo } from '@/lib/navigate'\r\nnavigateTo(123);`,
      errors: 2
    },
  ]
})



