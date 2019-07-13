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
  }
}
