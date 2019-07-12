import request from '@utils/http'
import {API_PUB} from '@utils/constant'

export default {
  /**
   * 供应商列表
   */
  getSupplierList(data, loading = false) {
    let url = API_PUB + '/api/platform/platform-supplier'
    return request.get({url, data, loading})
  },
  /**
   * 修改密码
   */
  resetPassword(data, loading = false) {
    let url = `${API_PUB}/api/platform/platform-supplier-operation/${data.id}`
    return request.post({url, data, loading})
  },
  /**
   * 冻结/解冻
   */
  changeStatus(data, loading = false) {
    let url = `${API_PUB}/api/platform/platform-supplier-operation/${data.id}`
    return request.post({url, data, loading})
  },

  /**
   * 供应商删除
   */
  supplierDelete(id, loading = false) {
    let url = `${API_PUB}/api/platform/platform-supplier-delete/${id}`
    return request.delete({url, data: {}, loading})
  },
  /**
   * 审核供应商
   */
  auditingSupplier(data, loading = false) {
    let url = `${API_PUB}/api/platform/platform-supplier-operation/${data.id}`
    return request.post({url, data, loading})
  },
  /**
   * 状态
   */
  getStatus(data, loading = false) {
    let url = API_PUB + '/api/platform/platform-supplier-statistic'
    return request.get({url, data, loading})
  }
}
