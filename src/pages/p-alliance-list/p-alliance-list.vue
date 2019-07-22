<template>
  <div class="p-alliance-list">
    <div class="down-content">
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" :infoText="requestData.keyword" placeHolder="输入加盟商名称" @search="search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page" style="display: flex; width: 100%">
          <img src="./icon-supplier_list@2x.png" class="identification-icon">
          <p class="identification-name" style="flex: 1">加盟商白名单</p>
          <button class="btn-main" style="margin-right: 10px;position: relative">批量导入
          <input type="file" style="opacity: 0;width: 100%;height: 100%;position: absolute" @change="importHandle">
          </button>
          <button class="btn-main" @click="addListHandle"><span class="add-icon"></span> 创建白名单</button>
        </div>
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
              <div v-if="+val.type === 4" :style="{ width: val.width}" class="list-operation-box item">
                <span class="list-operation" @click="deleteSupplier(item)">删除</span>
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

    <change-model ref="changeModel" @refresh="refreshHandle"></change-model>
    <default-confirm ref="confirm" @confirm="delAllianceHandle"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  // import AuditingModel from './auditing-model/auditing-model'
  import ChangeModel from './change-model/change-model'

  const PAGE_NAME = 'P_ALLIANCE_LIST'
  const TITLE = '加盟商白名单'

  const LIST_TITLE = [
    {name: '加盟商名称', flex: 1, value: 'name', type: 1},
    {name: '加盟商账号 ', flex: 1, value: 'mobile', type: 1},
    {name: '操作', flex: 1, value: '', type: 4, width: 78}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      // AuditingModel,
      ChangeModel,
      DefaultModal
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        requestData: {
          keyword: '',
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
        keyword: '',
        page: 1,
        limit: 10
      }
      API.Alliance.getList(data, true)
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
    methods: {
      addListHandle() {
        this.$refs.changeModel && this.$refs.changeModel.show()
      },
      refreshHandle() {
        this._getList()
      },
      _getList() {
        API.Alliance.getList(this.requestData).then(res => {
          let statePageTotal = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          this.supplierList = res.data
          this.pageDetail = statePageTotal
        })
      },
      search(keyword) {
        this.setData({page: 1, keyword})
        this.$refs.pagination.beginPage()
        this._getList()
      },
      addPage(page) {
        this.requestData.page = page
        this._getList()
      },
      deleteSupplier(item) {
        this.currentItem = item
        this.$refs.confirm.show(`删除账号白名单后该加盟商(${item.name})将无法登录集市`, '删除提示')
      },
      delAllianceHandle() {
        API.Alliance.deleteAlliance(this.currentItem.id).then(res => {
          this._getList()
        })
      },
      setData(data) {
        this.requestData = Object.assign({}, this.requestData, data)
      },
      importHandle(e) {
        let param = this._infoFile(e.target.files[0])
        this.$loading.show('上传中...')
        API.Alliance.importAlliance(param).then(res => {
          e.target.value = ''
          this._getList()
        })
      },
      // 格式化文件
      _infoFile(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .p-alliance-list
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
      max-width: 158px
  .list .list-item
    .grey
      cursor: not-allowed
      color: $color-text-assist
      &:hover
        color: $color-text-assist
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      line-height:1.4
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      #explain
        white-space: normal
        display: -webkit-box
        overflow: hidden
        -webkit-line-clamp: 2
        word-break: break-all
        -webkit-box-orient: vertical
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
