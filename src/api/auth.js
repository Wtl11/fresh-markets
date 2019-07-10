import request from '@utils/request'

export default {
  logIn(data, loading = true) {
    let url = '/market-info/api/jwt/login'
    return request.post(url, data, loading)
  },
  validate() {
    let url = '/market-info/api/jwt/token-validate'
    return request.get(url)
  }
}
