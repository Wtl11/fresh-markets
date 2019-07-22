import http from '@utils/http'
import {API_PUB} from '@utils/constant'

export default {
  loginPlatform(data, loading = true) {
    let url = API_PUB + '/api/platform/login'
    return http.post({url, data, loading})
  },
  login(data, loading = true) {
    let url = API_PUB + '/api/supplier/login'
    return http.post({url, data, loading})
  },
  validatePlatform() {
    let url = API_PUB + '/api/platform/token-validate'
    return http.get({url})
  },
  validate() {
    let url = API_PUB + '/api/supplier/token-validate'
    return http.get({url})
  },
  /**
   * ***************集市***************
   */
  // 登录
  loginInformation(data, loading = true) {
    let url = API_PUB + '/api/market/login'
    return http.post({url, data, loading})
  },
  // 发送短信验证码
  getCodeInformation(data, loading = true) {
    let url = API_PUB + '/api/market/login-send-code'
    return http.post({url, data, loading})
  },
  validateInformation(data, loading = false) {
    let url = API_PUB + '/api/market/token-validate'
    return http.get({url, data, loading})
  },
  /**
   * ***************集市***************
   */
}
