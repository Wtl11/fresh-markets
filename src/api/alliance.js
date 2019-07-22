import request from '@utils/http'
import {API_PUB} from '@utils/constant'

export default {
  /**
   * 加盟商列表
   */
  getList(data, loading = false) {
    let url = API_PUB + '/api/platform/platform-franchisees'
    return request.get({url, data, loading})
  },
  /**
   * 添加加盟商
   */
  pushAlliance(data, loading) {
    let url = API_PUB + '/api/platform/platform-franchisees'
    return request.post({url, data, loading})
  },
  /**
   * 删除加盟商
   */
  deleteAlliance(id, loading) {
    let url = API_PUB + '/api/platform/platform-franchisees-delete/' + id
    return request.delete({url, data: null, loading})
  },
  /**
   * 导入加盟商
   */
  importAlliance(file, loading) {
    let url = API_PUB + '/api/platform/platform-franchisees-import'
    return request.post({url, data: file, loading})
  },
}
