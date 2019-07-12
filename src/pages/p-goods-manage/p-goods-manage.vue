<template>
  <div class="goods-manage">
    <div class="down-content">
      <span class="down-tip">分类筛选</span>
      <div class="down-item-small">
        <div class="drop-down">
          <base-drop-down :select="firstCategory" @setValue="firstCategorySelect"></base-drop-down>
        </div>
        <div class="drop-down">
          <base-drop-down :select="secondCategory" @setValue="secondCategorySelect"></base-drop-down>
        </div>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" :infoText="requestData.keyword" placeHolder="请输入商品名称" @search="search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品列表</p>
          <base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
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

              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="item">
                {{(item.supplier && item.supplier.name) || '---'}}
              </div>


              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <span v-if="+item.audit_status === 1" class="list-operation" @click="auditing(item)">审核</span>
                <router-link v-if="+item.audit_status === 2" target="_blank" tag="a" :to="`/goods-detail?goodsId=${item.id}&supplierId=${item.supplier.id}`" class="list-operation">查看</router-link>
                <span v-if="+item.audit_status === 2" class="list-operation" @click="downGoods(item)">下架</span>
                <span v-if="+item.audit_status === 2" class="list-operation" @click="deleteGoods(item)">删除</span>
              </div>

              <div v-if="+val.type === 5 && +item.audit_status !== 1 && +item.audit_status !== 2" :style="{flex: val.flex}" class="list-operation-box item">---</div>
            </div>
          </div>
        </div>
        <base-blank v-else blackStyle="margin-top: 100px"></base-blank>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="requestData.page" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <auditing-model ref="auditingModel" @confirm="auditingConfirm"></auditing-model>
    <default-confirm ref="confirm" @confirm="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import AuditingModel from './auditing-model/auditing-model'
  const PAGE_NAME = 'GOODS-MANAGE'
  const TITLE = '商品管理'

  const FIRST_CATEGORY = {
    check: false,
    show: false,
    content: '一级分类',
    type: 'default',
    data: [{name: '水果'}]
  }
  const SECOND_CATEGORY = {
    check: false,
    show: false,
    content: '二级分类',
    type: 'default',
    data: [{name: '水果'}]
  }

  const LIST_TITLE = [
    {name: '图片', flex: 0.7, value: 'goods_cover_image', type: 2},
    {name: '商品名称', flex: 1.8, value: 'name', type: 3},
    {name: '供应商', flex: 1, value: 'supplier', type: 4},
    {name: '分类', flex: 1, value: 'goods_supplier_category', type: 1},
    {name: '采购规格', flex: 1, value: 'purchase_specs', type: 1},
    {name: '采购单价', flex: 1, value: 'purchase_price', type: 1},
    {name: '提交时间', flex: 1.2, value: 'submit_time', type: 1},
    {name: '审核说明', flex: 1, value: 'reason', type: 1},
    {name: '操作', flex: 2, value: '', type: 5}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      AuditingModel
    },
    data() {
      return {
        firstCategory: FIRST_CATEGORY,
        secondCategory: SECOND_CATEGORY,
        listTitle: LIST_TITLE,
        requestData: {
          keyword: '',
          goods_supplier_category_id: 0,
          audit_status: '',
          page: 1,
          limit: 10
        },
        statusTab: [
          {name: '全部', num: 0, value: ''},
          {name: '待审核', num: 0, value: 0},
          {name: '审核成功', num: 0, value: 1},
          {name: '审核失败', num: 0, value: 2}
        ],
        goodsList: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        defaultIndex: 0,
        currentItem: {},
        confirmStatus: ''
      }
    },
    computed: {},
    beforeRouteEnter(to, from, next) {
      let data = {
        goods_supplier_category_id: 0,
        audit_status: '',
        keyword: '',
        page: 1,
        limit: 10
      }
      API.PGoodsManage.getGoodsList(data, true)
        .then((res) => {
          next((vm) => {
            let statePageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            vm.goodsList = res.data
            vm.pageDetail = statePageTotal
          })
        })
        .catch(() => {
          next((vm) => {
            vm.$loading.hide()
          })
        })
    },
    created() {
      this.getCategoryData()
      this.getGoodsStatus()
    },
    mounted() {},
    methods: {
      // 选择一级分类
      firstCategorySelect(data) {
        this.secondCategory.content = '二级分类'
        this.secondCategory.data = data.list
        this.$refs.pagination.beginPage()
        this.setData({goods_supplier_category_id: data.id, page: 1})
        this.getGoodsList()
        this.getGoodsStatus()
      },
      // 选择二级分类
      secondCategorySelect(data) {
        this.secondCategory.content = data.name
        this.setData({page: 1, goods_supplier_category_id: data.id})
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
        this.setData({page: 1, audit_status: selectStatus.value})
        this.getGoodsList()
        this.$refs.pagination.beginPage()
      },
      // 翻页
      addPage(page) {
        this.requestData.page = page
        this.getGoodsList()
      },
      // 获取分类列表
      getCategoryData() {
        API.PGoodsManage.getCategoryList({parent_id: -1}, false).then((res) => {
          this.firstCategory.data = res.data
        })
      },
      // 获取列表
      getGoodsList() {
        API.PGoodsManage.getGoodsList(this.requestData, false).then((res) => {
          this.goodsList = res.data
          let statePageTotal = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          this.pageDetail = statePageTotal
        })
      },
      // 获取Tab栏状态
      getGoodsStatus() {
        API.PGoodsManage.getStatus({
          goods_supplier_category_id: this.requestData.goods_supplier_category_id
        }).then((res) => {
          this.statusTab = res.data.map((item, index) => {
            return {
              name: item.status_str,
              value: item.status,
              num: item.statistic
            }
          })
        })
      },
      auditing(item) {
        this.currentItem = item
        this.$refs.auditingModel.show()
      },
      auditingConfirm(data) {
        this.$refs.auditingModel.hide()
        API.PGoodsManage.auditingGoods({
          goods_supplier_id: this.currentItem.id,
          audit_status: data.status,
          reason: data.reason
        }).then((res) => {
          this.$toast.show('审核成功')
          this.getGoodsStatus()
          this.getGoodsList()
        })
      },
      deleteGoods(item) {
        this.currentItem = item
        this.confirmStatus = 'delete'
        this.$refs.confirm.show('确定删除' + item.name + '?')
      },
      downGoods(item) {
        this.currentItem = item
        this.confirmStatus = 'down'
        this.$refs.confirm.show('确定下架' + item.name + '?')
      },
      // 商品下架/删除
      confirm() {
        this.confirmStatus === 'down' &&
          API.PGoodsManage.goodsDown({goods_supplier_id: this.currentItem.id, is_online: 0}).then((res) => {
            this.$toast.show('该商品已成功下架')
            this.getGoodsStatus()
            this.getGoodsList()
          })
        this.confirmStatus === 'delete' &&
          API.PGoodsManage.goodsDelete(this.currentItem.id).then((res) => {
            this.$toast.show('该商品已成功删除')
            this.getGoodsStatus()
            this.getGoodsList()
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
      max-width: 158px
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
      .status-fail:before
        background: #E1E1E1
      .status-success:before
        background: $color-positive
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
</style>
