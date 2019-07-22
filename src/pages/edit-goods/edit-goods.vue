<template>
  <div class="edit-goods">
    <div class="title-con">
      <div class="icon"></div>
      <div class="title">{{pageTitle}}</div>
    </div>
    <div class="content">
      <div class="content-header content-padding-top">
        <div class="content-title">基本信息</div>
      </div>
      <div class="form-con">
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            类目
          </div>
          <div class="form-input-box mini-form-input-box">
            <base-drop-down :height="44" :width="195" :select="firstSelect"
                            @setValue="_setSelectValue($event, 'goods_supplier_category_id', 'secondSelect')"
            ></base-drop-down>
            <base-drop-down :height="44" :width="195" :select="secondSelect"
                            @setValue="_setSelectValue($event, 'goods_supplier_category_id')"
            ></base-drop-down>
            <div v-if="onlyCheck" class="disable-mask"></div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            商品主标题
          </div>
          <div class="form-input-box">
            <input v-model="goodsInfo.name" :disabled="onlyCheck" type="text" class="form-input" maxlength="30"
                   @mousewheel.native.prevent
            >
          </div>
          <div class="form-tip">商品在店铺商品显示的名称</div>
        </div>
        <div class="form-item">
          <div class="form-title">采购规格</div>
          <div class="form-input-box">
            <input v-model="goodsInfo.goods_supplier_skus[0].purchase_specs" :disabled="onlyCheck" type="text"
                   class="form-input" maxlength="10"
                   @mousewheel.native.prevent
            >
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            采购价格
          </div>
          <div class="form-input-box">
            <input v-model="goodsInfo.goods_supplier_skus[0].purchase_price" :disabled="onlyCheck" type="text"
                   class="form-input" @mousewheel.native.prevent
            >
          </div>
        </div>
        <section class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            商品起批量
          </div>
          <div class="form-input-box">
            <input v-model="goodsInfo.goods_start_num"
                   :disabled="onlyCheck"
                   type="number"
                   class="form-input"
                   @mousewheel.native.prevent
                   placeholder="默认为1件起批"
            >
          </div>
        </section>
      </div>
      <div class="content-header content-padding-top">
        <div class="content-title">图文信息</div>
      </div>
      <div class="form-con">
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            封面图
          </div>
          <div class="form-image-box">
            <div class="form-image">
              <draggable v-if="goodsInfo.goods_main_images" v-model="goodsInfo.goods_main_images" class="draggable">
                <div v-for="(item, index) in goodsInfo.goods_main_images" :key="index" class="show-image hand">
                  <img class="img" :src="item.image_url" alt="">
                  <span v-if="!onlyCheck" class="close" @click="_delImg('goods_main_images', index)"></span>
                </div>
              </draggable>
              <div v-if="!onlyCheck && goodsInfo.goods_main_images.length < 5" class="add-image hand">
                <input :disabled="onlyCheck" type="file" class="sendImage hand" multiple="multiple" accept="image/*"
                       @change="_addImg('goods_main_images', $event)"
                >
                <div v-if="uploadLoading && uploading === 'goods_main_images'" class="loading-mask">
                  <img src="./loading.gif" class="loading">
                </div>
              </div>
            </div>
            <div class="form-tip">建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传5张，首张为封面。</div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            详情图
          </div>
          <div class="form-image-box">
            <div class="form-image">
              <draggable v-if="goodsInfo.goods_detail_images" v-model="goodsInfo.goods_detail_images" class="draggable" @update="_setSort()">
                <div v-for="(item, index) in goodsInfo.goods_detail_images" :key="index" class="show-image hand">
                  <img class="img" :src="item.image_url" alt="">
                  <span v-if="!onlyCheck" class="close" @click="_delImg('goods_detail_images', index)"></span>
                </div>
              </draggable>
              <div v-if="!onlyCheck && goodsInfo.goods_detail_images.length < 15" class="add-image hand">
                <input type="file" class="sendImage hand" multiple="multiple" accept="image/*"
                       @change="_addImg('goods_detail_images', $event)"
                >
                <div v-if="uploadLoading && uploading === 'goods_detail_images'" class="loading-mask">
                  <img src="./loading.gif" class="loading">
                </div>
              </div>
            </div>
            <div class="form-tip">建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传15张。</div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-con">
      <div class="hand button cancel" @click="_goBack">{{onlyCheck ? '返回' : '取消'}}</div>
      <div v-if="!onlyCheck" class="hand button" @click="_subEdit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import * as Helpers from './helpers'
  import API from '@api'
  import Draggable from 'vuedraggable'
  import {uploadFiles} from '../../utils/cos/cos'
  const PAGE_NAME = 'EDIT_GOODS'
  let TITLE = '商品信息'
  const TITLE_TEXT = { check: '查看商品', edit: '编辑商品', create: '新建商品'}

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      Draggable
    },
    data() {
      this.submitting = false
      return {
        pageTitle: '编辑商品',
        onlyCheck: false,
        goodsId: '',
        goodsInfo: {
          goods_supplier_category_id: '',
          name: '',
          goods_supplier_skus: [{purchase_specs: '', purchase_price: '', goods_sku_code: '', goods_supplier_sku_id: ''}],
          goods_start_num: '',
          goods_main_images: [],
          goods_detail_images: []
        },
        firstSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        uploadLoading: false,
        uploading: ''
      }
    },
    beforeRouteEnter(to, from, next) {
      const goodsId = to.query.goodsId
      const type = to.query.type
      to.meta.crumbs[to.meta.crumbs.length - 1] = goodsId?'编辑商品':'新建商品'
      to.meta.crumbs[to.meta.crumbs.length - 1] = TITLE_TEXT[type]||'新建商品'
      if (goodsId) {
        API.GoodsManage.getGoodsInfo(goodsId).then((res) => {
          next((vw) => {
            vw._setGoodsInfo(res.data)
          })
        }).catch(() => {
          next((vw) => {
            vw.$loading.hide()
          })
        })
      } else {
        next((vw) => {
          vw._getCategoryData()
        })
      }
    },
    watch: {
      'goodsInfo.goods_start_num'(val) {
        console.log(val)
      }
    },
    mounted() {
      const type = this.$route.query.type
      this.onlyCheck = !!(type === 'check')
      this.pageTitle = TITLE_TEXT[type]||'新建商品'
      document.title = this.pageTitle
    },
    methods: {
      _setGoodsInfo(resData) {
        this.goodsId = resData.goods_supplier_id
        this._getCategoryData()
        this.goodsInfo = {
          goods_supplier_category_id: resData.goods_supplier_category_id,
          name: resData.name,
          goods_supplier_skus: resData.goods_supplier_skus,
          goods_start_num: resData.goods_start_num,
          goods_main_images: resData.goods_main_images,
          goods_detail_images: resData.goods_detail_images
        }
      },
      _getCategoryData() {
        API.GoodsManage.getCategoryData({parent_id: -1, goods_id: this.goodsId || ''}).then((res) => {
          this.firstSelect.data = res.data
          res.data.forEach((item) => {
            if (item.is_selected) {
              this.firstSelect.content = item.name
              this.secondSelect.data = item.list
              item.list.forEach((secondItem) => {
                if (secondItem.is_selected) {
                  this.secondSelect.content = secondItem.name
                  return false
                }
              })
              return false
            }
          })
        })
      },
      _setSelectValue(data, key, childKey = false) {
        this.goodsInfo[key] = data.id
        if (childKey) {
          this[childKey].data = data.list
          this[childKey].content = '二级类目'
        }
      },
      _setSort() {},
      _addImg(key, e) {
        this.uploadLoading = true
        this.uploading = key
        let imgArr = Array.from(e.target.files)
        uploadFiles({files: imgArr}).then((res) => {
          this.uploadLoading = false
          res.forEach((item) => {
            const resData = item.data
            this.goodsInfo[key].push({image_id: resData.id, id: 0, image_url: resData.url})
          })
        }).catch(() => {
          this.uploadLoading = false
        })
        e.target.value = ''// 清除选择的图片，否则同一个图片无法再次上传
      },
      _delImg(key, index) {
        this.goodsInfo[key].splice(index, 1)
      },
      _checkForm() {
        if (this.submitting) {
          return false
        }
        this.submitting = true
        let errorMsg = {
          goods_supplier_category_id: '请选择主营品类',
          name: '请输入商品主标题',
          goods_supplier_skus: '请输入采购价格',
          goods_main_images: '请上传商品封面图',
          goods_detail_images: '请上传商品详情图',
          goods_start_num: '起批量不能小于1'
        }
        for (let k in this.goodsInfo) {
          if (k === 'goods_supplier_skus') {
            if (!this.goodsInfo.goods_supplier_skus[0].purchase_price.trim()) {
              this.$toast.show(errorMsg[k])
              return false
            }
          } else if (k === 'goods_start_num') {
            if (+this.goodsInfo.goods_start_num < 1) {
              this.$toast.show(errorMsg[k])
              return false
            }
          } else if (k === 'goods_main_images' || k === 'goods_detail_images') {
            if (this.goodsInfo[k].length <= 0) {
              this.$toast.show(errorMsg[k])
              return false
            }
          } else {
            if (!(this.goodsInfo[k] + '').trim()) {
              this.$toast.show(errorMsg[k])
              return false
            }
          }
        }
        return true
      },
      _subEdit() {
        if (!this._checkForm()) {
          this.submitting = false
          return
        }
        let apiName = 'creatGoodsInfo'
        if (this.goodsId) {
          apiName = 'editGoodsInfo'
        }
        API.GoodsManage[apiName](this.goodsInfo, true, this.goodsId)
          .then((res) => {
            if (this.goodsId) {
              this.$toast.show('提交审核！')
            } else {
              this.$toast.show('保存成功！')
            }
            this.submitting = false
            this.$emit('refresh')
            this.$router.push(`/manager/goods-manage`)
          })
          .catch(() => {
            this.submitting = false
            this.$loading.hide()
          })
      },
      _goBack() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-goods
    width: 100%
    background: #fff
    padding-bottom: 80px
    .title-con
      height: 18px
      padding: 25px 20px
      layout(row)
      align-items: center
      background :#fff
      border-radius: 4px
      .icon
        width: 16px
        height: @width
        margin-right: 5px
        icon-image('./icon-newly_build')
      .title
        font-family: $font-family-regular
        font-size: 16px
        color: $color-text-main
        letter-spacing: 0
        line-height: 1

  .content
    position: relative
    flex: 1
    min-height: 762px
    background: $color-white
    padding: 0 20px 30px
    box-sizing: border-box
    .content-header
      line-height: 1
      padding: 16px 0
      display: flex
      align-items: center
      justify-content: space-between
      position: relative
      box-sizing: border-box
      border-bottom: 0.5px solid $color-line
      &:before
        content: ''
        position: absolute
        width: 34px
        height: 2px
        background: $color-main
        border-radius: 2px
        bottom: 0px
        left: 0
      .content-title
        color: #333333
        font-family: $font-family-regular
        font-size: $font-size-16
    .form-con
      box-sizing: border-box
      padding-bottom: 24px
      .form-item
        display: flex
        color: #2A2A2A
        min-height: 40px
        margin-top: 24px
        .form-title
          width: 94px
          height: 40px
          line-height: 40px
          font-size: $font-size-14
          font-family: $font-family-regular
          white-space: nowrap
          text-align: right
        .start
          display: inline-block
          margin-right: -2px
          color: #F52424
        .form-input-box
          margin: 0 10px 0 40px
          position: relative
          &.mini-form-input-box
            layout(row)
            div
              margin-right: 10px
            .disable-mask
              position: absolute
              width: 100%
              height: 100%
        .form-input
          box-sizing: border-box
          font-size: $font-size-14
          padding: 0 14px
          border-radius: 2px
          width: 400px
          height: 40px
          border: 0.5px solid $color-line
          transition: all 0.3s
          &:disabled
            color: $color-text-assist
            background: $color-white
          &::-webkit-inner-spin-button
            appearance: none
          &:hover
            border: 0.5px solid #ACACAC
          &::placeholder
            font-family: $font-family-regular
            color: $color-text-assist
          &:focus
            border-color: $color-main !important
        .form-input-unit
          width: 134px
          height: 40px
          line-height: 40px
          margin: 0 10px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
        .form-tip
          font-family: $font-family-regular
          font-size: 14px
          color: #ACACAC
          line-height: 40px
        .form-image-box
          margin-left: 40px
          .form-tip
            line-height: 1
          .form-image
            flex-wrap: wrap
            display: flex
            .draggable
              flex-wrap: wrap
              display: flex
            .add-image
              margin-bottom: 20px
              icon-image('pic-choice_img')
              height: 90px
              width: @height
              position: relative
              border-radius: 2px
              overflow: hidden
              .sendImage
                height: 100%
                width: 100%
                top: 0
                left: 0
                opacity: 0
                z-index: 1
                position: absolute
            .show-image
              margin-bottom: 20px
              background-repeat: no-repeat
              background-size: cover
              background-position: center
              height: 90px
              margin-right: 20px
              width: @height
              border-radius: 2px
              position: relative
              overflow: hidden
              .img
                height: 100%
            .close
              icon-image('icon-delete_img')
              width: 15px
              height: 15px
              position: absolute
              top: 0
              right: 0
              z-index: 100

            .loading-mask
              width: 100%
              height: 100%
              position: absolute
              top: 0
              left: 0
              background: rgba(0, 0, 0, .6)
              .loading
                all-center()
                width: 25px
                height: 25px
  .button-con
    position: absolute
    bottom: 0
    left: 0
    box-sizing: border-box
    width: 100%
    height: 80px
    background: #F9F9F9
    border-top: 0.5px solid #E9ECF0
    border-bottom-left-radius: 4px
    border-bottom-right-radius: 4px
    layout(row)
    align-items: center
    justify-content: center
    .button
      width: 96px
      height: 40px
      margin-right: 20px
      font-family: $font-family-regular
      font-size: 16px
      letter-spacing: 0
      line-height: 40px
      text-align: center
      color: #fff
      background: $color-main
      border: 0.5px solid $color-main
      border-radius: 4px
      &.cancel
        background: #fff
        color: #333333
        border: 0.5px solid #E9ECF0
        &:hover
          border: 0.5px solid #ACACAC
      &:hover
        opacity: 0.8
      &.disable
        opacity: 0.5

</style>
