import HTTP from './http'
import {app as APP} from '../main'
import {ERR_OK} from './config'
import storage from 'storage-controller'

const AUTHORITY_LOST = 10000 // 权限失效

HTTP.handleError((code) => {
  switch (code) {
    case AUTHORITY_LOST:
      break
    default:
      break
  }
})

HTTP.resCommonHandle(({res, loading, toast, formatter}) => {
  if (loading) {
    APP && APP.$loading && APP.$loading.hide()
  }
  if (!res || ERR_OK !== res.error) {
    if (typeof toast === 'function') {
      toast(res)
    } else if(toast) {
      APP && APP.$toast.show(res && res.message)
    }
  }
  if (typeof formatter === 'function') {
    return formatter(res)
  } else {
    return res
  }
})

HTTP.reqCommonHandle(({loading}) => {
  if (typeof loading === 'function') {
    loading()
  } else if (loading) {
    APP && APP.$loading && APP.$loading.show()
  }
})

HTTP.interceptorsRequest(config => {
  config.url = resetUrl(config.url)
  return config
})

function resetUrl(url) {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production'
  if (IS_PRODUCTION) {
    return url
  }
  let pathname = window.location.pathname
  if (pathname && pathname.indexOf('/v') > -1) {
    let version = pathname.substr(1)
    url = url.split('api/').join(`${version}api/`)
    return url
  }
  return url
}
HTTP.setHeaders({
  'Authorization': storage.get('auth.token'),
  'Current-Corp': process.env.VUE_APP_CURRENT_CORP
})
