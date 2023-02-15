
const {get, isLocObj} = require('../utils')

const message = "disallow location jump"

module.exports = {
  meta: {
    type: "problem",
    docs: {
        description: message,
        category: "Errors",
        recommended: true,
    },
    fixable: 'code',
    schema: [] // no options
  },
  create(context) {
    return {
      Program() {
        this.replaceInfo = {
          navigateTo: false,
          redirectTo: false,
        }
        this.importSpecifier = {
          navigateTo: false,
          redirectTo: false,
        }
      },
      'Program:exit': function(path) {
        const {navigateTo, redirectTo} = this.replaceInfo
        if (!navigateTo && !redirectTo) return

        const importNav = getImportNavigateStr({
          navigateTo: navigateTo || this.importSpecifier.navigateTo,
          redirectTo: redirectTo || this.importSpecifier.redirectTo,
        })
        const nodeBody = path.body
        const index = nodeBody.findIndex(i => i.type === 'ImportDeclaration' && i.source.value === '@/lib/navigate')
        if (index === -1) {
          return context.report({
            node: path,
            message: 'not import @/lib/navigate',
            fix: fixer =>  {
              return fixer.insertTextBefore(path, `${importNav}\r\n`)
            }
          })
        } else {
          return context.report({
            node: path,
            message: 'reimport @/lib/navigate',
            fix: fixer =>  {
              return fixer.replaceText(nodeBody[index], importNav)
            }
          })
        }
      },

      ImportSpecifier(node) {
        const idName = node.local.name
        if (idName === 'navigateTo') this.importSpecifier.navigateTo = true
        if (idName === 'redirectTo') this.importSpecifier.redirectTo = true
      },

      AssignmentExpression(path) {
        const {left, right} = path
        const {property, object} = left
        // location.href = xxx
        // document.location = xx
        // can not handle lacation = xxx
        if (left.type !== 'MemberExpression') return
        if (get(property, 'type') !== 'Identifier') return

        const pName = get(property, 'name')
        const isLocHref = pName === 'href' && isLocObj(object)
        const isWindowLoc = pName === 'location' && ['window', 'document'].indexOf(get(object, 'name')) >= 0

        if (isLocHref || isWindowLoc) {
          context.report({
            node: path,
            message,
            fix: fixer => {
              this.replaceInfo.navigateTo = true

              const paramStr = context.getSourceCode().getText(right)
              return fixer.replaceText(path, `navigateTo(${paramStr})`)
            }
          })
        }
      },
      CallExpression(path) {
        const {property, object} = path.callee
        if (get(property, 'type') !== 'Identifier') return
        const pNames = ['assign', 'replace']
        const funcName = get(property, 'name')
        if (pNames.indexOf(funcName) === -1) return
  
        if (isLocObj(object)) {
          context.report({
            node: path,
            message,
            fix: fixer => {
              const nav = funcName === 'replace' ? 'redirectTo' : 'navigateTo'
              const paramStr = context.getSourceCode().getText(path.arguments[0])
              
              this.replaceInfo[nav] = true

              return fixer.replaceText(path, `${nav}(${paramStr})`)
            }
          })
        }
      }
    }
  }
}

function getImportNavigateStr(obj) {
  const {navigateTo, redirectTo} = obj

  let importNav = ''
  if (navigateTo && redirectTo) {
    importNav = "import { navigateTo, redirectTo } from '@/lib/navigate'"
  } else if (redirectTo) {
    importNav = "import { redirectTo } from '@/lib/navigate'"
  } else if (navigateTo) {
    importNav = "import { navigateTo } from '@/lib/navigate'"
  }

  return importNav
}
