import http from '@utils/http'

export default {
  // 获取区域数据
  getAreasData(data) {
    let url = '/market-info/api/market/supplier-areas'
    return http.get({url, data})
  },
  // 获取店铺信息
  getSupplierInfo(data, loading = false) {
    let url = '/market-info/api/supplier/show'
    return http.get({url, data, loading})
  },
  // 新建店铺信息
  creatSupplierInfo(data, loading = false) {
    let url = '/market-info/api/supplier/store'
    return http.post({url, data, loading})
  },
  // 更新店铺信息
  editSupplierInfo(id, data, loading = false) {
    let url = `/market-info/api/supplier/update/${id}`
    return http.put({url, data, loading})
  }
}
