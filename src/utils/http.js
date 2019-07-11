import axios from 'axios'
const TIME_OUT = 10000
const ERR_OK = 0
const ERR_NO = -404
const COMMON_HEADER = {}

class Request {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Request()
    }
    return this.instance
  }
  constructor() {
    this.http = axios.create({
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    })
    this.errorCodeFn = undefined // 后台业务错误码处理函数
    this.resCommonFn = undefined // 响应参数后的处理函数
    this.beforeReqCommonFn = undefined // 请求前的处理函数
    this.interceptorsReqFn = undefined
    this.interceptorsResFn = undefined
    // 请求数据前的拦截
    const self = this
    this.http.interceptors.request.use(
      (config) => {
        if (typeof self.interceptorsReqFn === 'function') {
          self.interceptorsReqFn(config)
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应前数据前的拦截
    this.http.interceptors.response.use(
      (response) => {
        typeof self.interceptorsResFn === 'function' && self.interceptorsResFn(response)
        return response
      },
      (error) => {
        return Promise.resolve(error.response)
      }
    )
  }
  // 请求前拦截
  interceptorsRequest(fn) {
    this.interceptorsReqFn = fn
  }
  // 响应前拦截
  interceptorsResponse(fn) {
    this.interceptorsResFn = fn
  }
  get(args) {
    return this._formatReq({...args, method: 'GET', paramsKey: 'params'})
  }
  put(args) {
    return this._formatReq({...args, method: 'PUT'})
  }
  post(args) {
    return this._formatReq({...args, method: 'POST'})
  }
  delete(args) {
    return this._formatReq({...args, method: 'DELETE'})
  }
  /**
   *
   * @param method 方法名
   * @param paramsKey 参数key值
   * @param url 地址
   * @param data 参数
   * @param loading 加载处理函数
   * @param toast 吐司处理函数
   * @param formatter 数据格式化函数
   * @returns {Promise<AxiosResponse<any> | never>}
   * @private
   */
  _formatReq({method, paramsKey = 'data', url, data, loading = true, toast = true, formatter}) {
    typeof this.beforeReqCommonFn === 'function' && this.beforeReqCommonFn({loading})
    return this.http({
      url,
      [paramsKey]: data,
      method
    })
      .then((response) => {
        return this._checkStatus(response)
      })
      .then((res) => {
        return this._checkCode(res)
      })
      .then((res) => {
        return this.resCommonFn ? this.resCommonFn({res, loading, toast, formatter}) : res
      })
  }
  // 请求前的处理
  reqCommonHandle(fn) {
    this.beforeReqCommonFn = function(args) {
      fn(args)
    }
  }
  // 请求公共处理
  resCommonHandle(fn) {
    this.resCommonFn = function(args) {
      return typeof fn === 'function' ? fn(args) : args.res
    }
  }
  _checkStatus(response) {
    // _loading
    // 如果http状态码正常，则直接返回数据
    if (response && response.status < 400) {
      return response
      // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
      status: ERR_NO,
      msg: '网络异常'
    }
  }
  _checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === ERR_NO) {
      console.warn(res.msg)
    }
    // 如果网络请求成功，而提交的数据，或者是后端的一些未知错误所导致的，可以根据实际情况进行捕获异常
    if (res.data && res.data.code !== ERR_OK) {
      typeof this.errorCodeFn === 'function' && this.errorCodeFn(res.data.code)
      throw requestException(res)
    }
    return res.data
  }
  // 错误码处理
  handleError(fn) {
    this.errorCodeFn = fn
  }
  // 设置头部信息
  setHeaders(args) {
    for (let [key, value] of Object.entries(args)) {
      this.http.defaults.headers.common[key] = value
    }
  }
  // 可以修改http任意模式
  GodMode(fn) {
    fn && fn(this.http, this)
  }
}

function requestException(res) {
  const error = {}
  error.statusCode = res.status
  const serviceData = res.data
  if (serviceData) {
    error.code = serviceData.code
    error.error = serviceData.error
    error.message = serviceData.message
    error.serverData = serviceData
  }
  return error
}

export default Request.getInstance()
