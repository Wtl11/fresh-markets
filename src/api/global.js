import request from '@utils/http'

export default {
  /**
   * 获取微信JSSDK配置
   * @returns {*}
   */
  jssdkConfig(args) {
    let url = 'https://fresh-manager.jkweixin.net/social-shopping/api/backend/token-validate'
    return request.get({url, ...args})
  }
}
