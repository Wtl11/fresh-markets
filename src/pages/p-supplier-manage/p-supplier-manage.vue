<template>
  <div class="goods-manage">
    <div class="down-content">
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" :infoText="requestData.keyword" placeHolder="输入供应商名称" @search="search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="" class="identification-icon">
          <p class="identification-name">供应商列表</p>
          <base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="new-coupon" append class="btn-main"><span class="add-icon"></span>新建商品</router-link>
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
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item" @click="showBigImg(item.image_url)">
                <img :src="require('./img.jpg')" alt="" class="img">
              </div>
              <div v-if="+val.type === 3" :style="{flex: val.flex}" class="item explain">
                {{item[val.value] || '---'}}
              </div>
              <!--状态-->
              <div v-if="false" :style="{flex: val.flex}" class="status-item item" :class="item.status === 1 ? 'status-success' : item.status === 2 ? 'status-fail' : ''">{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已结束' : ''}}</div>
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="list-operation-box item">
                <span v-if="false" class="list-operation" @click="auditing(item)">审核</span>
                <router-link tag="span" to="/manager/supplier-detail" class="list-operation">查看</router-link>
                <span class="list-operation" @click="deleteSupplier(item)">删除</span>
              </div>

              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="status-item item" :class="item.status === 1 ? 'status-success' : item.status === 2 ? 'status-fail' : ''">{{item.status === 0 ? '审核中' : item.status === 1 ? '审核成功' : item.status === 2 ? '审核失败' : ''}}
              </div>

              <div v-if="+val.type === 6 && +requestData.status > 0" :style="{flex: val.flex}" class="status-item item" :class="item.status === 1 ? 'status-success' : item.status === 2 ? 'status-fail' : ''">{{item[val.value]}}
              </div>
            </div>
          </div>
        </div>
        <base-blank v-else blackStyle="margin-top: 6%"></base-blank>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="requestData.page" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>

    <default-modal ref="imgModal" class="img-model">
      <div slot="content">
        <div class="top">
          <div class="title">营业执照</div>
          <span class="close" @click="$refs.imgModal.hideModal()"></span>
        </div>
        <div class="model-img-wrap">
          <img src="./img.jpg" alt="" class="big-img">
        </div>
      </div>
    </default-modal>

    <auditing-model ref="auditingModel" @confirm="auditingConfirm"></auditing-model>
    <change-model ref="changeModel" @confirm="changePassword"></change-model>
    <default-confirm ref="confirm" confirm="deleteConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import Http from '@utils/http'
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import AuditingModel from './auditing-model/auditing-model'
  import ChangeModel from './change-model/change-model'
  const PAGE_NAME = 'GOODS-MANAGE'
  const TITLE = '供应商管理'

  const LIST_TITLE = [
    {name: '供应商编号', flex: 1, value: 'code', type: 1},
    {name: '供应商名称', flex: 1, value: 'name', type: 1},
    {name: '区域', flex: 1, value: 'area', type: 1},
    {name: '分类', flex: 1, value: 'category', type: 1},
    {name: '营业执照', flex: 0.7, value: 'img_url', type: 2},
    {name: '联系人', flex: 1, value: 'contact', type: 1},
    {name: '联系方式', flex: 1, value: 'mobile', type: 1},
    {name: '提交时间', flex: 1, value: 'time', type: 1},
    {name: '状态', flex: 1, value: 'status', type: 1},
    {name: '审核说明', flex: 1, value: 'explain', type: 3},
    {name: '操作', flex: 1.6, value: '', type: 4}
  ]

  const LIST_TITLE1 = [
    {name: '供应商编号', flex: 1, value: 'code', type: 1},
    {name: '供应商名称', flex: 1, value: 'name', type: 1},
    {name: '区域', flex: 1, value: 'area', type: 1},
    {name: '分类', flex: 1, value: 'category', type: 1},
    {name: '营业执照', flex: 0.7, value: 'img_url', type: 2},
    {name: '联系人', flex: 1, value: 'contact', type: 1},
    {name: '联系方式', flex: 1, value: 'mobile', type: 1},
    {name: '提交时间', flex: 1, value: 'time', type: 1},
    {name: '操作', flex: 1.6, value: '', type: 4}
  ]

  const LIST_TITLE2 = [
    {name: '供应商编号', flex: 1, value: 'code', type: 1},
    {name: '供应商名称', flex: 1, value: 'name', type: 1},
    {name: '区域', flex: 1, value: 'area', type: 1},
    {name: '分类', flex: 1, value: 'category', type: 1},
    {name: '营业执照', flex: 0.7, value: 'img_url', type: 2},
    {name: '联系人', flex: 1, value: 'contact', type: 1},
    {name: '联系方式', flex: 1, value: 'mobile', type: 1},
    {name: '提交时间', flex: 1, value: 'time', type: 1},
    {name: '审核说明', flex: 1, value: 'explain', type: 3},
    {name: '操作', flex: 1.6, value: '', type: 4}
  ]

  const GOODS_LIST = [
    {
      img_url: './img.jpg',
      name: '阿克苏苹果阿克苏苹果',
      area: '白云区国际单位',
      category: '水果',
      contact: '王某人',
      mobile: '13584260103',
      code: '5645641',
      time: '2019-07-19 15:18:00'
    },
    {
      img_url: './img.jpg',
      name: '阿克苏苹果阿克苏苹果',
      area: '白云区国际单位',
      category: '水果',
      contact: '王某人',
      mobile: '13584260103',
      explain: '审核',
      code: '5645641',
      time: '2019-07-19 15:18:00'
    },
    {
      img_url: './img.jpg',
      name: '阿克苏苹果阿克苏苹果',
      area: '白云区国际单位',
      category: '水果',
      contact: '王某人',
      mobile: '13584260103',
      code: '5645641',
      time: '2019-07-19 15:18:00'
    },
    {
      img_url: './img.jpg',
      goods_name: '阿克苏苹果阿克苏苹果',
      supplier: '隔壁老王',
      category: '水果',
      contact: '王某人',
      mobile: '13584260103',
      explain: '审核',
      code: '690205',
      time: '2019-07-19 15:18:00'
    }
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      AuditingModel,
      ChangeModel,
      DefaultModal
    },
    data() {
      return {
        // listTitle: LIST_TITLE,
        requestData: {
          keyword: '',
          category_id: '',
          status: '',
          page: 1,
          limit: 10
        },
        statusTab: [
          {name: '全部', num: 0, value: ''},
          {name: '待审核', num: 0, value: 0},
          {name: '审核成功', num: 0, value: 1},
          {name: '审核失败', num: 0, value: 2}
        ],
        goodsList: GOODS_LIST,
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        defaultIndex: 0,
        currentItem: {},
        currentImgSrc: ''
      }
    },
    computed: {
      listTitle() {
        switch (this.requestData.status) {
        case '':
          return LIST_TITLE
        case 0:
          return LIST_TITLE1
        case 1 || 2:
          return LIST_TITLE2
        default:
          return LIST_TITLE
        }
      }
    },
    created() {
      // this.getCategoriesData()
      // this.getGoodsStatus()
    },
    mounted() {
      // this.$refs.changeModel.show()
      // this.$refs.confirm.show('sdfsjdklfjs')
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
      // 翻页
      addPage(page) {
        this.goodsPage = page
        this.getGoodsList()
      },
      // 获取列表
      getGoodsList() {
        console.log('getGoods')
        // let data = {
        //   goods_category_id: this.categoryId,
        //   status: this.status,
        //   keyword: this.keyWord,
        //   is_online: '',
        //   page: this.goodsPage,
        //   limit: 10
        // }
        // Http.Product.getGoodsList(data, false).then((res) => {
        //   if (res.error === this.$ERR_OK) {
        //     this.goodsList = res.data
        //     let statePageTotal = {
        //       total: res.meta.total,
        //       per_page: res.meta.per_page,
        //       total_page: res.meta.last_page
        //     }
        //     this.pageDetail = statePageTotal
        //   } else {
        //     this.$toast.show(res.message)
        //   }
        // })
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
      showBigImg(src){
        this.currentImgSrc = src
        this.$refs.imgModal.showModal()
      },
      auditing(item) {
        this.currentItem = item
        this.$refs.auditingModel.show()
      },
      auditingConfirm(data) {
        console.log(data)
        this.$refs.auditingModel.hide()
      },
      changePassword(data) {
        console.log(data)
      },
      deleteSupplier(item) {
        this.currentItem = item
        this.$refs.confirm.show('确定下架'+ item.goods_name+ '?', '删除')
      },
      // 商品下架
      deleteConfirm() {
        let data = {
          goods_id: this.currentItem.id,
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
    display: flex
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
  .list-box,.list-header
    .list-item:last-child
      max-width: 80px
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
      .goods-name
        display: flex
        flex-direction: column
        .bottom
          color: #666
          margin-top: 6px
        .text
          text-overflow: ellipsis
          overflow: hidden
      .img
        width: 42px
        height: 42px
        border-radius: 4px
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
      .list-double-row
        .item-sub
          color: #333
  .img-model
    .top
      align-items: center
      background: #fff
      justify-content: space-between
      padding: 20px
      layout(row)
      .title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main
      .close
        cursor pointer
        width: 12px
        height: 12px
        icon-image('icon-close')
    .model-img-wrap
      background: #fff
      height: 600px
      width: 500px
      text-align center
      padding:20px
    .big-img
      max-width: 100%
      max-height: 100%
</style>
