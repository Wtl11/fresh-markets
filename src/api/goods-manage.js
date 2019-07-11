import http from '@utils/http'

export default {
  // 获取分类数据
  getCategoryData(data, loading = false) {
    let url = '/market-info/api/supplier/goods-material-category'
    return http.get({url, data, loading})
  },
  // 获取商品统计
  getGoodsStatus(data, loading = false) {
    let url = '/market-info/api/supplier/goods-supplier-status'
    return http.get({url, data, loading})
  },
  // 获取商品列表
  getGoodsList(data, loading = true) {
    let url = '/market-info/api/supplier/goods-supplier'
    return http.get({url, data, loading})
  },
  // 获取商品信息
  getGoodsInfo(id, data = {}, loading = true) {
    let url = `/market-info/api/supplier/goods-supplier/${id}`
    return http.get({url, data, loading})
  },
  // 新建商品
  creatGoodsInfo(data, loading = true) {
    let url = '/market-info/api/supplier/goods-supplier'
    return http.post({url, data, loading})
  },
  // 修改商品
  editGoodsInfo(data, loading = true, id) {
    let url = `/market-info/api/supplier/goods-supplier/${id}`
    return http.put({url, data, loading})
  }
}
