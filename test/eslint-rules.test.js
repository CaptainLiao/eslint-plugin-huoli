const rule = require('../src/lib/rules/no-location-jump')

const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: 'module' } })
ruleTester.run('huoli/no-location-jump', rule, {
  valid: [
    {
      code: 'winLoca = window.location;'
    }
  ],
  invalid: [
    {
      code: 'location.href = 123;',
      output: `import { navigateTo } from '@/lib/navigate'\r\nlocation.href = 123;`,
      errors: [{ message: "disallow location jump" }, {message: 'not import @/lib/navigate'}]
    },
    {
      code: 'location.replace(123);',
      output: `import { redirectTo } from '@/lib/navigate'\r\nlocation.replace(123);`,
      errors: [{ message: "disallow location jump" }, {message: 'not import @/lib/navigate'}]
    },
  ]
})



