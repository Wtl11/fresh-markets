<template>
  <div class="apply-suppliers">
    <div class="logo"></div>
    <div class="title-con">
      <div class="icon"></div>
      <div class="title">申请成为供应商</div>
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
            <input v-model="applyData.name" type="text" class="form-input" maxlength="29"
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
            <base-drop-down :height="44" :width="195" :select="areaSelect" @setValue="_setSelectValue($event, 'area')"></base-drop-down>
          </div>
        </div>
        <div class="form-item  form-image-box">
          <div class="form-title">
            <span class="start">*</span>
            营业执照
          </div>
          <div class="form-image-box">
            <div class="form-image">
              <div v-if="applyData.image_id && uploadImg.license" class="draggable">
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
            <input v-model="applyData.name" type="text" class="form-input" maxlength="29"
                   @mousewheel.native.prevent
            >
          </div>
          <div class="form-input-unit">件</div>
        </div>
        <div class="form-item  form-image-box">
          <div class="form-title">
            <span class="start">*</span>
            微信二维码
          </div>
          <div class="form-image-box">
            <div class="form-image">
              <div v-if="applyData.wechat_image_id && uploadImg.QRCode" class="draggable">
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
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import * as cos from '../../utils/cos/cos'
  import {fileType} from '../../utils/cos/file-config'

  const PAGE_NAME = 'APPLY_SUPPLIERS'
  const TITLE = '申请成为供应商'
  const SELECT_TEST = [
    { id: 1, name: '广东' },
    { id: 2, name: '北京' },
    { id: 3, name: '上海' }
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        applyData: {
          name
        },
        provinceSelect: {check: false, show: false, content: '请选择省份', type: 'default', data: SELECT_TEST},
        citySelect: {check: false, show: false, content: '请选择城市', type: 'default', data: SELECT_TEST},
        areaSelect: {check: false, show: false, content: '请选择区/县', type: 'default', data: SELECT_TEST},
        uploadImg: {license:'',QRCode:''},
        uploadLoading: false,
        uploading: ''
      }
    },
    methods: {
      _setSelectValue(data, key) {
        this.applyData[key] = data.id
      },
      _addImg(applyKey, uploadKey, e) {
        this.uploading = applyKey
        let arr = Array.from(e.target.files)
        e.target.value = ''
        if (arr.length < 1) return
        arr = arr.slice(0, 1)
        this.uploadLoading = true
        cos.uploadFiles(fileType.IMAGE_TYPE, arr).then((resArr) => {
          let imagesArr = []
          resArr.forEach((item) => {
            if (item.error !== this.$ERR_OK) {
              return this.$toast.show(item.message)
            }
            let obj = {
              id: 0,
              image_id: item.data.id,
              image_url: item.data.url
            }
            imagesArr.push(obj)
          })
          this.applyData[applyKey] = imagesArr[0].image_id
          this.uploadImg[uploadKey] = imagesArr[0].image_url
          this.uploadLoading = false
        })
      },
      _delImg(applyKey, uploadKey) {
        this.applyData[applyKey] = ''
        this.uploadImg[uploadKey] = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .apply-suppliers
    position: absolute
    width: 100%
    height: 100%
    background: #fff
    .logo
      width: 150px
      height: 48px
      margin: 26px 15px 33px
      bg-image('./pic-apply_logo')
      background-size: 100%
    .title-con
      height: 18px
      margin-left: 30px
      margin-bottom: 25px
      layout(row)
      align-items: center
      .icon
        width: 16px
        height: @width
        margin-right: 5px
        icon-image('./icon-newly_build')
      .title
        font-family: $font-family-medium
        font-size: 18px
        color: $color-text-main
        letter-spacing: 0
        line-height: 1


  .content
    position: relative
    flex: 1
    background: $color-white
    padding: 0 30px 80px
    box-sizing: border-box
    .content-header
      line-height: 1
      padding: 16px 0
      display: flex
      align-items: center
      justify-content: space-between
      position: relative
      box-sizing: border-box
      border-bottom: 1px solid $color-line
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
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-16
    .form-con
      padding: 0 20px
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
          border: 1px solid $color-line
          transition: all 0.3s
          &:disabled
            color: $color-text-assist
            background: $color-white
          &::-webkit-inner-spin-button
            appearance: none
          &:hover
            border: 1px solid #ACACAC
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
</style>
