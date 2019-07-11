import request from '@utils/http'
import {API_PUB} from '@utils/constant'

export default {
  /**
   * 分类列表
   * @param parent_id
   */
  getCategoryList(data, loading = false) {
    let url = API_PUB + '/api/platform/goods-material-category'
    return request.get({url, data, loading})
  },
  /**
   * 商品列表
   *
   */
  getGoodsList(data, loading = false) {
    let url = API_PUB + '/api/platform/goods-supplier'
    return request.get({url, data, loading})
  },
  /**
   * 商品下架
   * @param is_online
   * @param goods_supplier_id
   */
  goodsDown(data, loading = false) {
    let url = API_PUB + '/api/platform/goods-supplier-toggle-online'
    return request.post({url, data, loading})
  },
  /**
   * 商品删除
   *
   * @param goods_supplier_id
   */
  goodsDelete(id, loading = false) {
    let url = `${API_PUB}/api/platform/goods-supplier/${id}`
    return request.delete({url, data: {}, loading})
  },
  /**
   * 审核商品
   *
   */
  auditingGoods(data, loading = false) {
    let url = API_PUB + '/api/platform/goods-supplier-audit'
    return request.post({url, data, loading})
  },
  /**
   * 状态
   *
   */
  getStatus(data, loading = false) {
    let url = API_PUB + '/api/platform/goods-supplier-status'
    return request.get({url, data, loading})
  },

}
