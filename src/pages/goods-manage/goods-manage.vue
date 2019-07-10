<template>
  <div class="goods-manage">
    <div class="down-content">
      <span class="down-tip">分类筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="firstCategory" @setValue="firstCategorySelect"></base-drop-down>
        <base-drop-down :select="secondCategory" @setValue="secondCategorySelect"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" :infoText="requestData.keyword" placeHolder="请输入商品名称" @search="search"></base-search>
      </div>
    </div>
    <div class="list-content">
      <div class="identification">
        <div class="identification-page">
          <img src="" class="identification-icon">
          <p class="identification-name">商品列表</p>
          <base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
      </div>
      <div class="list-box">

      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="requestData.page" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Http from '@utils/http'
  const PAGE_NAME = 'GOODS-MANAGE'
  const TITLE = '商品管理'

  const FIRST_CATEGORY = {
    check: false,
    show: false,
    content: '一级分类',
    type: 'default',
    data: []
  }
  const SECOND_CATEGORY = {
    check: false,
    show: false,
    content: '二级分类',
    type: 'default',
    data: []
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        firstCategory: FIRST_CATEGORY,
        secondCategory: SECOND_CATEGORY,
        requestData: {
          keyword: '',
          category_id: '',
          status: '',
          page: 1,
          limit: 10
        },
        statusTab: [
          {name: '全部', num: 0},
          {name: '待审核', num: 0},
          {name: '审核成功', num: 0},
          {name: '审核失败', num: 0}
        ],
        goodsList: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        defaultIndex: 0
      }
    },
    created() {
      // this.getCategoriesData()
      // this.getGoodsStatus()
    },
    mounted() {

    },
    methods: {
      // 选择一级分类
      firstCategorySelect(data) {
        this.secondCategorySelect.content = '二级分类'
        this.secondCategorySelect.data = data.list
        this.$refs.pagination.beginPage()
        this.setData({category_id: data.id, page: 1})
        this.getGoodsList()
        this.getGoodsStatus()
      },
      // 选择二级分类
      secondCategorySelect(data) {
        this.secondSelect.content = data.name
        this.setData({page: 1, category_id: data.id})
        this.$refs.pagination.beginPage()
        this.getGoodsList()
        this.getGoodsStatus()
      },
      search(keyword) {
        this.setData({page: 1, keyword})
        this.$refs.pagination.beginPage()
        this.getGoodsList()
        this.getGoodsStatus()
      },
      // 切换tab栏
      changeStatus(selectStatus) {
        this.setData({page: 1, status: selectStatus.value})
        this.getGoodsList()
        this.$refs.pagination.beginPage()
      },
      // 分页
      addPage(page) {
        this.goodsPage = page
        this._updateList({page}, true)
        // this.getGoodsListData()
      },
      // 获取列表
      getGoodsList() {
        let data = {
          goods_category_id: this.categoryId,
          status: this.status,
          keyword: this.keyWord,
          is_online: '',
          page: this.goodsPage,
          limit: 10
        }
        Http.Product.getGoodsList(data, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.goodsList = res.data
            let statePageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            this.pageDetail = statePageTotal
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取Tab栏状态
      getGoodsStatus() {
        Http.Goods.getGoodsStatus({
          goods_category_id: this.goodsFitter.goods_category_id,
          source: this.goodsFitter.source,
          complete_status: this.goodsFitter.complete_status,
          is_presale: this.goodsFitter.is_presale,
          has_stock: this.goodsFitter.has_stock,
          keyword: this.goodsFitter.keyword
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusTab = res.data.map((item, index) => {
            return {
              name: item.status_str,
              value: item.status,
              num: item.statistic
            }
            // this.$set(this.statusTab[index], 'num', item.statistic)
          })
        })
      },
      // 商品下架
      downGoods(item, index) {
        let data = {
          goods_id: item.id,
          is_online: 0
        }
        Http.Goods.downGoods(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$refs.confirm.show('该商品已成功下架')
            this.getGoodsStatus()
            this.getGoodsList()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      setData(data) {
        this.requestData = Object.assign({}, this.requestData, data)
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-manage
    width: 100%
    background: #fff
    flex: 1
    .down-content
      padding: 0 20px
      box-sizing: border-box
      min-height: 72px
      background: #fff
      align-items: center
      margin-bottom: 20px
      flex-wrap: wrap
      .down-tip
        font-size: $font-size-12
        color: #333
        margin-right: 10px
      .down-item-small
        display: flex
        margin-right: 10px
      .down-item
        display: flex
        margin-right: 30px
    .list-content
      display: flex
      padding: 0 20px
      background: #fff
      flex-direction: column
      flex: 1
      .identification
        display: flex
        align-items: center
        justify-content: space-between
        height: 60px
        background: #ffffff
        box-sizing: border-box
        .identification-page
          display: flex
          align-items: center
        .identification-icon
          width: 14px
          height: 14px
          margin-right: 5px
        .identification-name
          color: #333
          font-size: $font-size-16
          line-height: 1
          white-space: nowrap
          font-family: $font-family-regular
    .list-box
      max-height: 645px
      background: #ffffff
      overflow: visible
      display: flex
      flex-direction: column
      flex: 1
    .pagination-box
      height: 60px
      align-items: center
      display: flex
</style>
