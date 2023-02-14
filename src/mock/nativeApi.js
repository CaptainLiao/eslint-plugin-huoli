import bridge from './huoli-bridge'
import qs from './querystring'

let retryCounter = 0

const ready_ = new Promise((resolve, reject) => {
  let loopCheck = setInterval(function () {
    bridge.connect(() => {
      if (bridge.isSupported) {
        clearInterval(loopCheck)
        retryCounter = 0
        resolve()
      } else if (!bridge.isSupported && ++retryCounter <= 5) {
        return
      } else {
        clearInterval(loopCheck)
        retryCounter = 0
        reject({
          msg: '此操作需要在客户端内进行',
          code: 'NATIVE_API_NOT_FOUND',
        })
      }
    })
  }, 500)
})

function ready() {
  return ready_
}

function invoke(method, params) {
  return new Promise((resolve, reject) => {
    if (window.huoli && window.huoli.native === 'disabled') {
      return reject(new Error('invoke native api fail: disabled'))
    } else {
      ready().then(() => {
        setTimeout(function () {
          bridge.invoke(method, params, (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          })
        }, 0)
      })
    }
  })
}

export default {
  ready: ready,
  invoke: invoke,
  on: bridge.on,
  // 关闭 native 弹窗，关闭 openOuterUrl 打开的 webview
  closeOuterUrl(paramObj) {
    let url = 'weixinhbgj://start?type=navigationback'
    if (paramObj) {
      url += `&${qs.stringify(paramObj)}`
    }

    window.location.href = url
  },

  // native 中打开站外（非航班）url
  openOuterUrl(url) {
    window.location.href = `weixinhbgj://start?type=embedweb&url=${encodeURIComponent(
      url,
    )}`
  },
}
