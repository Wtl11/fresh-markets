import request from '@utils/http'

export default {
  /**
   * 获取微信JSSDK配置
   * @returns {*}
   */
  jssdkConfig(args) {
    let url = 'https://fresh-manager.jkweixin.com/scm/api/backend/statistics/base-data'
    return request.get({url, ...args})
  }
}
