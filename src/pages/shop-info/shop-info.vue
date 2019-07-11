<template>
  <div class="shop-info">
    <div class="title-con">
      <div class="icon"></div>
      <div class="title">店铺信息</div>
    </div>
    <div class="content">
      <div class="content-header content-padding-top">
        <div class="content-title">基本信息</div>
      </div>
      <div class="form-con">
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            供应商名称
          </div>
          <div class="form-input-box">
            <input v-model="shopInfo.name" type="text" class="form-input" maxlength="29"
                   @mousewheel.native.prevent
            >
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            区域
          </div>
          <div class="form-input-box mini-form-input-box">
            <base-drop-down :height="44" :width="195" :select="provinceSelect" @setValue="_setSelectValue($event, 'province')"></base-drop-down>
            <base-drop-down :height="44" :width="195" :select="citySelect" @setValue="_setSelectValue($event, 'city')"></base-drop-down>
            <base-drop-down :height="44" :width="195" :select="districtSelect" @setValue="_setSelectValue($event, 'district')"></base-drop-down>
          </div>
        </div>
        <div class="form-item  form-image-box">
          <div class="form-title">
            <span class="start">*</span>
            营业执照
          </div>
          <div class="form-image-box">
            <div class="form-image">
              <div v-if="shopInfo.image_id && uploadImg.license" class="draggable">
                <div class="show-image hand">
                  <img class="img" :src="uploadImg.license" alt="">
                  <span class="close" @click="_delImg('image_id', 'license')"></span>
                </div>
              </div>
              <div v-else class="add-image hand">
                <input type="file"
                       class="sendImage hand"
                       multiple="multiple"
                       accept="image/*"
                       @change="_addImg('image_id', 'license', $event)"
                >
                <div v-if="uploadLoading && uploading === 'image_id'" class="loading-mask">
                  <img src="./loading.gif" class="loading">
                </div>
              </div>
            </div>
            <div class="form-tip">请上传小于5MB的jpg/jpeg/png格式的图片</div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            商品起批量
          </div>
          <div class="form-input-box">
            <input v-model="shopInfo.goods_start_num" type="text" class="form-input" placeholder="请输入起批量件数"
                   maxlength="29" @mousewheel.native.prevent
            >
          </div>
          <div class="form-input-unit">件</div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            主营品类
          </div>
          <div class="form-input-box mini-form-input-box">
            <base-drop-down :height="44" :width="195" :select="firstSelect" @setValue="_setSelectValue($event, 'category_id')"></base-drop-down>
            <base-drop-down :height="44" :width="195" :select="secondSelect" @setValue="_setSelectValue($event, 'category_id')"></base-drop-down>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            联系人
          </div>
          <div class="form-input-box">
            <input v-model="shopInfo.contact" type="text" class="form-input" placeholder="请输入联系人信息"
                   maxlength="29" @mousewheel.native.prevent
            >
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            联系电话
          </div>
          <div class="form-input-box">
            <input v-model="shopInfo.mobile" type="text" class="form-input" placeholder="请输入联系人手机号码"
                   maxlength="29" @mousewheel.native.prevent
            >
          </div>
        </div>
        <div class="form-item  form-image-box">
          <div class="form-title">
            <span class="start">*</span>
            微信二维码
          </div>
          <div class="form-image-box">
            <div class="form-image">
              <div v-if="shopInfo.wechat_image_id && uploadImg.QRCode" class="draggable">
                <div class="show-image hand">
                  <img class="img" :src="uploadImg.QRCode" alt="">
                  <span class="close" @click="_delImg('wechat_image_id', 'QRCode')"></span>
                </div>
              </div>
              <div v-else class="add-image hand">
                <input type="file"
                       class="sendImage hand"
                       multiple="multiple"
                       accept="image/*"
                       @change="_addImg('wechat_image_id', 'QRCode', $event)"
                >
                <div v-if="uploadLoading && uploading === 'wechat_image_id'" class="loading-mask">
                  <img src="./loading.gif" class="loading">
                </div>
              </div>
            </div>
            <div class="form-tip">请上传小于5MB的jpg/jpeg/png格式的图片</div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-con">
      <div class="hand button cancel">取消</div>
      <div :class="approveStatus * 1 === 0?'disable':''" class="hand button confirm" @click="_subApply">{{approveArr[approveStatus]}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import {uploadFiles} from '../../utils/cos/cos'
  const PAGE_NAME = 'SHOP_INFO'
  const TITLE = '店铺信息'
  const SELECT_TEST = [
    { id: 1, name: '广东' },
    { id: 2, name: '北京' },
    { id: 3, name: '上海' }
  ]
  const APPROVE_TEXT = ['审核中...', '提交审核', '提交审核']
  let submitting = false

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        shopInfo: {name: '', province: '', city: '', district: '', image_id: '', goods_start_num: '', category_id: '', contact: '', mobile: '', wechat_image_id: ''},
        provinceSelect: {check: false, show: false, content: '请选择省份', type: 'default', data: SELECT_TEST},
        citySelect: {check: false, show: false, content: '请选择城市', type: 'default', data: SELECT_TEST},
        districtSelect: {check: false, show: false, content: '请选择区/县', type: 'default', data: SELECT_TEST},
        firstSelect: {check: false, show: false, content: '一级类目', type: 'default', data: SELECT_TEST},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: SELECT_TEST},
        uploadImg: {license:'',QRCode:''},
        uploadLoading: false,
        uploading: '',
        approveArr: APPROVE_TEXT,
        approveStatus: 0,
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vw) => {
        API.SupplierInfo.getSupplierInfo()
          .then((res) => {
            if (res.error !== 0) {
              // vw.$toast.show(res.message)
              return
            }
            console.log(res.data)
            vw._getSupplierInfo(res.data)
          })
      })
    },
    methods: {
      _getSupplierInfo(resData) {
        this.provinceSelect.content = resData.province
        this.citySelect.content = resData.city
        this.districtSelect.content = resData.district
        this.approveStatus = resData.approve_status
      },
      _setSelectValue(data, key) {
        this.shopInfo[key] = data.id
      },
      _addImg(applyKey, uploadKey, e) {
        this.uploading = applyKey
        this.uploadLoading = true
        uploadFiles({files: [e.target.files[0]]}).then(res => {
          this.uploadLoading = false
          const resData = res[0].data
          if (resData.error !== this.$ERR_OK) {
            this.$toast.show(resData.message)
            return
          }
          this.shopInfo[applyKey] = resData.id
          this.uploadImg[uploadKey] = resData.url
        })
      },
      _delImg(applyKey, uploadKey) {
        this.shopInfo[applyKey] = ''
        this.uploadImg[uploadKey] = ''
      },
      _checkForm() {
        if(this.approveStatus === 0 || submitting) {
          return false
        }
        let errorMsg = {
          name: '请输入供应商名称',
          province: '请选择省份', city: '请选择城市', district: '请选择区/县',
          image_id: '请上传营业执照',
          goods_start_num: '请输入商品起批量',
          category_id: '请选择主营品类',
          contact: '请输入联系人',
          mobile: '请输入联系电话',
          wechat_image_id: '请上传微信二维码'
        }
        for (let k in this.shopInfo) {
          if(!this.shopInfo[k].trim()) {
            this.$toast.show(errorMsg[k])
            return false
          }
        }
        return true
      },
      _subApply() {
        if(!this._checkForm()) return
        submitting = true
        API.SupplierInfo.editSupplierInfo(this.shopInfo, true)
          .then((res) => {
            if (res.error !== 0) {
              this.$toast.show(res.message)
              return
            }
            console.log(res.data)
          })
          .finally(() => {
            submitting = false
            this.$loading.hide()
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .shop-info
    width: 100%
    background: #fff
    .title-con
      height: 18px
      margin: 25px 20px
      layout(row)
      align-items: center
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
          margin-left: 40px
          position: relative
          &.mini-form-input-box
            layout(row)
            div
              margin-right: 20px
        .form-input
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
          line-height: 14px
        .form-image-box
          margin-left: 40px
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
              .icon-video
                width: 26px
                height: @width
                all-center()
              .video
                height: 90px
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
    box-sizing: border-box
    width: 100%
    height: 80px
    padding-left: 153px
    background: #F9F9F9
    border-top: 0.5px solid #E9ECF0
    layout(row)
    align-items: center
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
