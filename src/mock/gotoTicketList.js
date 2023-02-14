/**
 * 活动页跳转至机票搜索页面：（请保证下列所有参数为String）
 * params {
 *   // 通用
 *   dep,        起飞地三字码 -- 必传
 *   arr,        到达地三字码 -- 必传
 *   date,       去程日期 YYYY-MM-DD -- 必传
 *   fdate,      回程日期 YYYY-MM-DD -- 客户端不传表示搜索单程;web参数中若传journeyType为rt，该值必传，否则可空
 *   fben,       舱位，4:经济舱/7:公务/头等 -- 可空
 *   purpose,    app | web(强制跳转到APP | H5) -- 可空，不传自动判断环境进行跳转
 *   airlinecode,航空公司 初始状态下，默认筛选显示的航司，多个以英文逗号间隔如 ca,cw,dc，国内仅支持单个航司 -- 可空
 *
 *   // 客户端参数
 *   param,              服务器定制参数 -- 可空
 *   analyseSourceEntry, 搜索源，用于统计 -- 必传
 *
 *   // web参数
 *   sort,              国内搜索结果排序方式, start从早到晚| price从低到高 | -- 可空，默认为start
 *   sort,              国际搜索结果排序方式，none推荐排序 | start起飞最早 | price价格最优 | time耗时最短 | -- 可空，默认为none
 *   orgair             出发地是机场还是城市 1:机场 0:城市  -- 可空 默认为0
 *   dstair,            到达地是机场还是城市 1:机场 0:城市  -- 可空 默认为0
 *   h5mark,            标识国内还是国际，domestic | international -- 可空，不传默认跳转国内，建议传
 *   depname,           出发地名称，城市 or 机场  -- 可空
 *   arrname,           到达地名称，城市 or 机场  -- 可空
 *   hastax,            是否显示含税价，0不含税 | 1含税 -- 可空，默认为0，属跳转国际机票列表参数
 *   authcode,          用户登录后的token，可空，无默认值，若传该参数跳转列表页不会再去登录
 *   journeyType,       单程往返，ow 单程  rt 往返 -- 可空，不传时默认单程
 *   analyseSourceEntry 活动渠道透传参数
 * }
 */
import nativeApi from '@/utils/nativeApi'
import env from '@/utils/env'
import qs from '../utils/querystring'
import localStorage from '@/utils/localStorage'
const h5LinkD = `${process.env.VUE_APP_BASE_URL_HANGBANH5}/vue/jipiao/search/domestic/list`
const h5LinkRT = `${process.env.VUE_APP_BASE_URL_HANGBANH5}/vue/jipiao/search/domestic/list-rt`
const h5LinkI = `${process.env.VUE_APP_BASE_URL_HANGBANH5}/vue/jipiao/search/international/list`
const appLink = 'weixinhbgj://start?type=ticketlist'
const h5ToAPPLink = 'https://www.133.cn/hbgj/start?type=ticketlist'
const hlsource = env.hlsource

function gotoTicketList(o) {
  document.location = _r.url

  location = b
  const purpose = o.purpose || ''
  let _r = null
  if (purpose && purpose === 'app') {
    _r = skip.toC(o)
  } else if (purpose && purpose === 'web') {
    _r = skip.toW(o)
  } else {
    _r = env.isNative ? skip.toC(o) : skip.toW(o)
  }


  if (_r.code) {
    // APP内
    if (env.isNative) {
      nativeApi.invoke('createWebView', { url: _r.url })
    } else {
      location.href = _r.url
      location = _r.url
      window.location = _r.url
      document.location = _r.url
    }
  } else {
    console.error(_r.msg)
  }
}

export default gotoTicketList


