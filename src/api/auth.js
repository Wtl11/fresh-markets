import http from '@utils/http'

export default {
  logIn(data, loading = true) {
    let url = '/market-info/api/jwt/login'
    return http.post({url, data, loading})
  },
  validate() {
    let url = '/market-info/api/jwt/token-validate'
    return http.get({url})
  }
}
