import request from '@utils/http'
import {API_PUB} from '@utils/constant'

export default {
  // 商品分类列表
  getGoodsClassifyList(args) {
    let url = API_PUB + '/api/market/goods-material-category'
    return request.get({url, ...args})
  },
  // 区域列表
  getAreasList(args) {
    let url = API_PUB + '/api/market/supplier-areas'
    return request.get({url, ...args})
  },
  // 按商品搜索列表
  getGoodsList(args) {
    let url = API_PUB + '/api/market/goods-supplier'
    return request.get({url, ...args})
  },
  // 供应商列表
  getMarketList(args) {
    let url = API_PUB + '/api/market/supplier'
    return request.get({url, ...args})
  }
}
