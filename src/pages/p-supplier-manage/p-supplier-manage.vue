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
          <img src="./icon-supplier_list@2x.png" class="identification-icon">
          <p class="identification-name">供应商列表</p>
          <base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
        <!--<div class="function-btn">
          <router-link tag="div" to="new-coupon" append class="btn-main"><span class="add-icon"></span>新建商品</router-link>
        </div>-->
      </div>
      <div class="big-list">
        <div class="list-header">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div v-if="supplierList.length" class="list">
          <div v-for="(item, index) in supplierList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in listTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{item[val.value] || '---'}}
              </div>
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item" @click="showBigImg(item.image_url)">
                <img :src="item[val.value]" alt="" class="img">
              </div>
              <div v-if="+val.type === 3" :style="{flex: val.flex}" class="item explain">
                {{item[val.value] || '---'}}
              </div>

              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="list-operation-box item">
                <span v-if="+item.approve_status === 0" class="list-operation" @click="auditing(item)">审核</span>
                <router-link v-if="+item.approve_status === 1" target="_blank" tag="a" :to="'/business-detail?supplierId=' + item.id" class="list-operation">查看</router-link>
                <span v-if="+item.approve_status === 1" class="list-operation" @click="resetPassword(item)">修改密码</span>
                <span v-if="+item.approve_status !== 0" class="list-operation" @click="deleteSupplier(item)">删除</span>
              </div>

              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="item list-item">
                <div class="list-item-btn" @click="switchBtn(item, index)">
                  <base-switch :status="item.is_freeze ? 0 : 1" confirmText="开启" cancelText="冻结"></base-switch>
                </div>
              </div>

              <div v-if="+val.type === 6" :style="{flex: val.flex}" class="item">
                {{item.province}}{{item.city}}{{item.district}}
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
          <img :src="currentImgSrc" alt="" class="big-img">
        </div>
      </div>
    </default-modal>

    <auditing-model ref="auditingModel" @confirm="auditingConfirm"></auditing-model>
    <change-model ref="changeModel" @confirm="changePassword"></change-model>
    <default-confirm ref="confirm" @confirm="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import AuditingModel from './auditing-model/auditing-model'
  import ChangeModel from './change-model/change-model'
  const PAGE_NAME = 'GOODS-MANAGE'
  const TITLE = '供应商管理'

  const LIST_TITLE = [
    {name: '供应商编号', flex: 0.8, value: 'id', type: 1},
    {name: '供应商名称', flex: 1, value: 'name', type: 1},
    {name: '区域', flex: 1.2, value: 'area', type: 6},
    {name: '分类', flex: 1, value: 'goods_material_category', type: 1},
    {name: '营业执照', flex: 0.7, value: 'image_url', type: 2},
    {name: '联系人', flex: 1, value: 'contact', type: 1},
    {name: '联系方式', flex: 1, value: 'mobile', type: 1},
    {name: '提交时间', flex: 1, value: 'created_at', type: 1},
    {name: '审核说明', flex: 1, value: 'explain', type: 3},
    {name: '状态', flex: 1, value: 'status', type: 5},
    {name: '操作', flex: 1.8, value: '', type: 4}
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
        listTitle: LIST_TITLE,
        requestData: {
          keyword: '',
          approve_status: '',
          page: 1,
          limit: 10
        },
        statusTab: [
          {name: '全部', num: 0, value: ''},
          {name: '待审核', num: 0, value: 0},
          {name: '审核成功', num: 0, value: 1},
          {name: '审核失败', num: 0, value: 2}
        ],
        supplierList: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        defaultIndex: 0,
        currentItem: {},
        currentImgSrc: '',
        confirmStatus: ''
      }
    },
    computed: {},
    beforeRouteEnter(to, from, next) {
      let data = {
        approve_status: '',
        keyword: '',
        page: 1,
        limit: 10
      }
      API.PSupplierManage.getSupplierList(data, true)
        .then((res) => {
          next((vm) => {
            let statePageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            vm.supplierList = res.data
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
      this.getSupplierStatus()
    },
    mounted() {},
    methods: {
      search(keyword) {
        this.setData({page: 1, keyword})
        this.$refs.pagination.beginPage()
        this.getSupplierList()
        this.getSupplierStatus()
      },
      // 切换tab栏
      changeStatus(selectStatus) {
        this.setData({page: 1, approve_status: selectStatus.value})
        this.getSupplierList()
        this.$refs.pagination.beginPage()
      },
      // 翻页
      addPage(page) {
        this.requestData.page = page
        this.getSupplierList()
      },
      // 获取列表
      getSupplierList() {
        API.PSupplierManage.getSupplierList(this.requestData, false).then((res) => {
          let statePageTotal = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          this.supplierList = res.data
          this.pageDetail = statePageTotal
        })
      },
      // 获取Tab栏状态
      getSupplierStatus() {
        API.PSupplierManage.getStatus().then((res) => {
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
      showBigImg(src) {
        this.currentImgSrc = src
        this.$refs.imgModal.showModal()
      },
      switchBtn(item, index) {
        let isFreeze = item.is_freeze ? 0 : 1
        API.PSupplierManage.changeStatus({is_freeze: isFreeze, id: item.id}).then((res) => {
          this.getSupplierList()
        })
      },
      auditing(item) {
        this.currentItem = item
        this.$refs.auditingModel.show()
      },
      auditingConfirm(data) {
        this.$refs.auditingModel.hide()
        API.PSupplierManage.auditingSupplier({
          id: this.currentItem.id,
          approve_status: data.status,
          note: data.reason
        }).then((res) => {
          this.$toast.show('审核成功')
          this.getSupplierStatus()
          this.getSupplierList()
        })
      },
      resetPassword(item) {
        this.currentItem = item
        this.$refs.changeModel.show()
      },
      changePassword(data) {
        API.PSupplierManage.resetPassword({password: data.password, id: this.currentItem.id}).then((res) => {
          this.$toast.show('修改密码成功')
          this.$refs.changeModel.hide()
        })
      },
      deleteSupplier(item) {
        this.currentItem = item
        this.$refs.confirm.show('确定删除' + item.name + '供应商?', '删除')
      },
      // 删除供应商
      confirm() {
        API.PSupplierManage.supplierDelete(this.currentItem.id).then((res) => {
          this.$toast.show('该供应商已成功删除')
          this.getSupplierStatus()
          this.getSupplierList()
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
    min-width: 1300px
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
