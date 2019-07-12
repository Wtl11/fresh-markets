<template>
  <div class="goods-manage">
    <div class="down-content">
      <span class="down-tip">分类筛选</span>
      <div class="down-item-small">
        <div class="drop-down">
          <base-drop-down :select="firstSelect" @setValue="_setSelectValue($event, 'goods_supplier_category_id', 'secondSelect')"></base-drop-down>
        </div>
        <div class="drop-down">
          <base-drop-down :select="secondSelect" @setValue="_setSelectValue($event, 'goods_supplier_category_id')"></base-drop-down>
        </div>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" :infoText="requestData.keyword" placeHolder="商品名称或编码" @search="_keywordSearch"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品列表</p>
          <base-status-tab :infoTabIndex="0" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="/manager/goods-manage/edit-goods" append class="btn-main g-btn-item">新建商品<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div v-if="goodsList.length" class="list">
          <div v-for="(item, index) in goodsList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in listTitle" :key="ind" :style="{flex: val.flex}" class="list-item">

              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{item[val.value] || '---'}}
              </div>

              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item">
                <img :src="item[val.value]" alt="" class="img">
              </div>

              <div v-if="+val.type === 3" :style="{flex: val.flex}" class="item list-double-row">
                <span class="text top">{{item[val.value]}}</span>
                <span class="text bottom">{{item.goods_sku_code}}</span>
              </div>

              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="list-operation-box item">
                <template v-if="item.audit_status === 2">
                  <span class="list-operation" @click="downGoods(item, 'check')">查看</span>
                  <span class="list-operation" @click="downGoods(item, 'edit')">编辑</span>
                </template>
                <span v-else-if="item.audit_status === 3" class="list-operation" @click="downGoods(item, 'subAgain')">重新提交</span>
                <span v-else class="list-operation no-line">---</span>
              </div>

              <div v-if="+val.type === 6" :style="{flex: val.flex}" class="status-item item"
                   :class="'status-'+item.audit_status"
              >
                {{item[val.value]}}
              </div>
            </div>
          </div>
        </div>
        <base-blank v-else blackStyle="margin-top: 100px"></base-blank>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="requestData.page" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <router-view class="route-view" @refresh="refresh"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  const PAGE_NAME = 'GOODS_MANAGE'
  const TITLE = '商品管理'

  const LIST_ALL = [
    {name: '图片', flex: 0.7, value: 'goods_cover_image', type: 2},
    {name: '商品名称', flex: 1.8, value: 'name', type: 3},
    {name: '分类', flex: 1, value: 'goods_supplier_category', type: 1},
    {name: '采购规格', flex: 1, value: 'purchase_specs', type: 1},
    {name: '采购单价', flex: 1, value: 'purchase_price', type: 1},
    {name: '状态', flex: 1, value: 'audit_status_str', type: 1},
    {name: '提交时间', flex: 1.2, value: 'submit_time', type: 1},
    {name: '审核说明', flex: 1, value: 'audit_status_str', type: 6},
    {name: '操作', flex: 1.6, value: '', type: 4}
  ]
  const LIST1 = [
    {name: '图片', flex: 0.7, value: 'goods_cover_image', type: 2},
    {name: '商品名称', flex: 1.8, value: 'name', type: 3},
    {name: '分类', flex: 1, value: 'goods_supplier_category', type: 1},
    {name: '采购规格', flex: 1, value: 'purchase_specs', type: 1},
    {name: '采购单价', flex: 1, value: 'purchase_price', type: 1},
    {name: '状态', flex: 1, value: 'audit_status_str', type: 1},
    {name: '提交时间', flex: 1.2, value: 'submit_time', type: 1}
  ]
  const LIST2 = [
    {name: '图片', flex: 0.7, value: 'goods_cover_image', type: 2},
    {name: '商品名称', flex: 1.8, value: 'name', type: 3},
    {name: '分类', flex: 1, value: 'goods_supplier_category', type: 1},
    {name: '采购规格', flex: 1, value: 'purchase_specs', type: 1},
    {name: '采购单价', flex: 1, value: 'purchase_price', type: 1},
    {name: '状态', flex: 1, value: 'audit_status_str', type: 1},
    {name: '提交时间', flex: 1.2, value: 'submit_time', type: 1},
    {name: '操作', flex: 1.6, value: '', type: 4}
  ]
  const LIST3 = [
    {name: '图片', flex: 0.7, value: 'goods_cover_image', type: 2},
    {name: '商品名称', flex: 1.8, value: 'name', type: 3},
    {name: '分类', flex: 1, value: 'goods_supplier_category', type: 1},
    {name: '采购规格', flex: 1, value: 'purchase_specs', type: 1},
    {name: '采购单价', flex: 1, value: 'purchase_price', type: 1},
    {name: '状态', flex: 1, value: 'audit_status_str', type: 1},
    {name: '提交时间', flex: 1.2, value: 'submit_time', type: 1},
    {name: '审核说明', flex: 1, value: 'audit_status_str', type: 6},
    {name: '操作', flex: 1.6, value: '', type: 4}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        firstSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        requestData: {
          keyword: '',
          goods_supplier_category_id: '',
          audit_status: '',
          page: 1,
          limit: 10
        },
        tabStatus: '',
        statusTab: [
          {name: '全部', num: 0, value: ''},
          {name: '审核中', num: 0, value: 1},
          {name: '审核成功', num: 0, value: 2},
          {name: '审核失败', num: 0, value: 3}
        ],
        goodsList: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        currentItem: {}
      }
    },
    computed: {
      listTitle() {
        switch (this.tabStatus) {
        case '':
          return LIST_ALL
        case 1:
          return LIST1
        case 2:
          return LIST2
        case 3:
          return LIST3
        default:
          return LIST_ALL
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      API.GoodsManage.getGoodsList({page: 1, limit: 10}).then((res) => {
        next((vw) => {
          vw._setGoodsListData(res)
        })
      })
    },
    created() {
      this._getGoodsStatus()
      this._getCategoryData()
    },
    methods: {
      _getGoodsList() {
        API.GoodsManage.getGoodsList(this.requestData).then((res) => {
          this._setGoodsListData(res)
        })
        this._getGoodsStatus()
      },
      _setGoodsListData(res) {
        this.goodsList = res.data
        this.pageDetail = {
          total: res.meta.total,
          per_page: 10,
          total_page: res.meta.last_page
        }
      },
      _getGoodsStatus() {
        API.GoodsManage.getGoodsStatus({
          goods_supplier_category_id: this.requestData.goods_supplier_category_id || ''
        }).then((res) => {
          res.data.forEach((item) => {
            if (item.status === '') {
              this.statusTab[0].num = item.statistic
            } else {
              this.statusTab[item.status].num = item.statistic
            }
          })
        })
      },
      _getCategoryData() {
        API.GoodsManage.getCategoryData({parent_id: -1}).then((res) => {
          this.firstSelect.data = [{id: '', name: '全部一级类目'}, ...res.data]
        })
      },
      _setSelectValue(data, key, childKey = false) {
        this.requestData[key] = data.id
        if (childKey) {
          this[childKey].data = data.list
          this[childKey].content = '二级类目'
        }
        this._getGoodsList()
      },
      _keywordSearch(keyword) {
        this.setData({page: 1, keyword})
        this.$refs.pagination.beginPage()
        this._getGoodsList()
      },
      // 切换tab栏
      changeStatus(selectStatus) {
        this.tabStatus = selectStatus.value
        this.setData({page: 1, audit_status: selectStatus.value})
        this.$refs.pagination.beginPage()
        this._getGoodsList()
      },
      // 翻页
      addPage(page) {
        this.requestData.page = page
        this._getGoodsList()
      },
      downGoods(item, type) {
        this.$router.push(`/manager/goods-manage/edit-goods?goodsId=${item.id}&type=${type}`)
      },
      setData(data) {
        this.requestData = Object.assign({}, this.requestData, data)
      },
      refresh() {
        this._getGoodsList()
        this._getGoodsStatus()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .route-view
    position :absolute
    top:0
    left :0
    right :0
    bottom: 0
    z-index :50
    border: 1px solid #E9ECF0
    border-radius: 4px

  .goods-manage
    position :relative
    display: flex
    min-width: 1300px
    flex-direction: column
    .down-content
      padding: 0 20px
      box-sizing: border-box
      min-height: 80px
      background: #fff
      align-items: center
      margin-bottom: 20px
      flex-wrap: wrap
      .down-tip
        font-size: $font-size-12
        color: $color-text-main
        margin-right: 10px
      .down-item-small
        display: flex
        margin-right: 20px
      .drop-down
        margin-right: 10px
      .down-item
        display: flex
        margin-right: 30px
    .pagination-box
      height: 60px
      align-items: center
      display: flex
  .list-header,.list-box
    .list-item:last-child
      padding-right: 0
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      line-height:1.2
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .list-double-row
        display: flex
        flex-direction: column
        .bottom
          color: #666
          margin-top: 6px
        .text
          text-overflow: ellipsis
          overflow: hidden
      .status-item:before
        content: ""
        display: inline-block
        width: 9px
        height: 9px
        border-radius: 50%
        margin-right: 6px
        background: $color-negative
      .status-1:before
        background: #F0B359
      .status-2:before
        background: #1FBB91
      .status-3:before
        background: #ED575A
      .img
        width: 42px
        height: 42px
        border-radius: 4px
        object-fit: cover
        border: 1px solid $color-line
      .status-item:before
        content: ""
        display: inline-block
        width: 9px
        height: 9px
        border-radius: 50%
        margin-right: 6px
        background: $color-negative
      .status-fail:before
        background: #E1E1E1
      .status-success:before
        background: $color-positive
  .list .list-content .list-operation.no-line
    color: $color-text-main
    text-decoration: none
</style>
