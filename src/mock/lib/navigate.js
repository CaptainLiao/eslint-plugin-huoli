import router from '@/router'
import qs from '@/utils/querystring'
import env from '@/utils/env'
import nativeApi from '@/utils/nativeApi'
import trackingParams from '@/config/trackingParams'

// path: 跳转路径，支持两种格式
//       1. http开头的绝对地址，例如：https://h5.133.cn/webapp
//       2. vue-router的path，例如: /cheap-flight/home
// query: query对象，例如 {id: 123}
export function navigateTo({ path, query = {} }) {
  const routerInfo = parseFullUrl({ path, query })
  if (env.isNative) {
    return nativeApi.invoke('createWebView', {
      url: getFullUrl(routerInfo),
    })
  }

  if (path.indexOf('http') >= 0) {
    return (window.location.href = getFullUrl(routerInfo))
  }

  return router.push({
    path,
    query,
  })
}

export function redirectTo({ path, query = {} }) {
  const routerInfo = parseFullUrl({ path, query })

  if (env.isNative) {
    return nativeApi.invoke('createWebView', {
      url: getFullUrl(routerInfo),
    })
  }

  if (path.indexOf('http') >= 0) {
    return window.location.replace(getFullUrl(routerInfo))
  }

  return router.replace({
    path,
    query,
  })
}

function parseFullUrl({ path, query }) {
  const [p, q] = path.split('?')
  if (env.mpname) {
    query.mpname = env.mpname
  }
  return {
    path: p.indexOf('http') >= 0 ? p : process.env.VUE_APP_BASE_URL_H5 + p,
    query: {
      ...trackingParams.get(),
      ...(q ? qs.parse(q) : null),
      ...query,
    },
  }
}

function getFullUrl({ path, query }) {
  const s = qs.stringify(query)
  return s ? `${path}?${s}` : path
}
