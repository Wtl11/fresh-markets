import HTTP from './http'
import {app as APP} from '../main'
import {ERR_OK} from './config'

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
    APP.$loading && APP.$loading.hide()
  }
  if (ERR_OK !== res.error) {
    if (typeof toast === 'function') {
      toast(res)
    } else if(toast) {
      APP.$toast.show(res.message)
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
    APP.$loading && APP.$loading.show()
  }
})
