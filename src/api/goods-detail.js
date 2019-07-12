import http from '@utils/http'
import {API_PUB} from '@utils/constant'

export default {
  // 商品详情
  getGoodsDetail(id, loading = false) {
    let url = `${API_PUB}/api/market/goods-supplier/${id}`
    return http.get({url, data: {}, loading})
  },
  // 供应商详情
  getSupplierDetail(id, loading = false) {
    let url = `${API_PUB}/api/market/supplier/${id}`
    return http.get({url, data: {}, loading})
  },
  // 推荐商品列表
  getGoodsList(data, loading = false) {
    let url = `${API_PUB}/api/market/goods-supplier`
    return http.get({url, data, loading})
  }
}
