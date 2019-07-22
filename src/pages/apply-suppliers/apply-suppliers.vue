<template>
  <div class="apply-suppliers">
    <div class="logo hand" @click="_goToMain"></div>
    <div v-if="!subModify" class="title-con">
      <div class="icon"></div>
      <div class="title">申请成为供应商</div>
    </div>
    <div v-if="!subModify" class="content">
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
            <input v-model="shopInfo.name" type="text" class="form-input" maxlength="25"
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
            <city-select ref="city" :height="44" :width="195" @setValue="_setCityValue"></city-select>
          </div>
        </div>
        <div class="form-item  form-image-box">
          <div class="form-title">
            <span class="start">*</span>
            营业执照
          </div>
          <div class="form-image-box">
            <section style="display: flex; align-items: center">
              <draggable v-model="uploadCertificateList">
                <article v-for="(item, index) in uploadCertificateList" :key="item.id" class="form-image more">
                  <div v-if="item.url" class="draggable">
                    <div class="show-image hand">
                      <img class="img" :src="item.url" alt="">
                      <span class="close" @click="deleteImageHandle({key: 'uploadCertificateList', index: index})"></span>
                    </div>
                  </div>
                </article>
              </draggable>
              <article v-if="uploadCertificateList.length < 5" class="form-image more">
                <div class="add-image hand">
                  <input type="file"
                         class="sendImage hand"
                         multiple="multiple"
                         accept="image/*"
                         @change="addImagesHandle($event, {key: 'uploadCertificateList', limit: 5})"
                  >
                  <div v-if="uploading === 'uploadCertificateList'" class="loading-mask">
                    <img src="./loading.gif" class="loading">
                  </div>
                </div>
              </article>
            </section>
            <div class="form-tip">请上传小于5MB的jpg/jpeg/png格式的图片, 最多可上传5张图片</div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <span class="start">*</span>
            主营品类
          </div>
          <div class="form-input-box mini-form-input-box">
            <base-drop-down :height="44" :width="195" :select="firstSelect" @setValue="_setSelectValue($event, 'category_id', 'secondSelect')"></base-drop-down>
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
                   maxlength="20" @mousewheel.native.prevent
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
                   maxlength="11" @mousewheel.native.prevent
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
    <div v-if="!subModify" class="button-con">
      <div class="hand button cancel" @click="_goBack">取消</div>
      <div class="hand button confirm" @click="_subApply">提交审核</div>
    </div>
    <div v-if="subModify" class="approve-tips-model">
      <div class="tips-con">
        <img src="./icon-success@2x.png" class="tips-img">
        <div class="tips-title">提交审核成功，请耐心等待</div>
        <div class="tips-text">审核结果会在72小时内以短信形式通知您，请留意手机</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import {uploadFiles} from '../../utils/cos/cos'
  import CitySelect from '@components/city-select/city-select'
  import Draggable from 'vuedraggable'

  const PAGE_NAME = 'APPLY_SUPPLIERS'
  const TITLE = '申请成为供应商'
  let submitting = false

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      CitySelect,
      Draggable
    },
    data() {
      return {
        shopInfo: {
          name: '',
          province: '',
          city: '',
          district: '',
          images: [],
          category_id: '',
          contact: '',
          mobile: '',
          wechat_image_id: '',
        },
        firstSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        uploadImg: {license:'',QRCode:''},
        uploadLoading: false,
        uploading: '',
        subModify: false,
        uploadCertificateList: []
      }
    },
    mounted() {
      this._getCategoryData()
    },
    methods: {
      _getCategoryData() {
        API.GoodsManage.getCategoryData({parent_id: -1})
          .then((res) => {
            this.firstSelect.data = res.data
          })
      },
      _setSelectValue(data, key, childKey = false) {
        this.shopInfo[key] = data.id
        if(childKey) {
          this[childKey].data = data.list
        }
      },
      _setCityValue(data) {
        this.shopInfo.province = data[0].includes('请选择') ? '' : data[0]
        this.shopInfo.city = data[1].includes('请选择') ? '' : data[1]
        this.shopInfo.district = data[2].includes('请选择') ? '' : data[2]
      },
      _addImg(applyKey, uploadKey, e) {
        this.uploading = applyKey
        this.uploadLoading = true
        uploadFiles({files: [e.target.files[0]]}).then(res => {
          this.uploadLoading = false
          const resData = res[0].data
          this.shopInfo[applyKey] = resData.id
          this.uploadImg[uploadKey] = resData.url
        }).catch(() => {
          this.uploadLoading = false
        })
        e.target.value = ''// 清除选择的图片，否则同一个图片无法再次上传
      },
      // 删除图片
      deleteImageHandle({key, index}) {
        this[key].splice(index, 1)
      },
      // 添加图片
      addImagesHandle(e, {key, limit}) {
        if (this.uploading === key) {
          this.$toast.show('图片上传中,请勿重复操作！')
          return
        }
        let arr = e.target.files
        let files = []
        let increasedQuantity = Math.max(limit - this[key].length, 0)
        for (let f of arr) {
          if (files.length < increasedQuantity) {
            files.push(f)
          }
        }
        this.uploading = key
        uploadFiles({files}).then(res => {
          this[key] = this[key].concat(res.map(item => {
            let data = item.data || {}
            return {
              url: data.url,
              id: data.id
            }
          }))
          this.uploading = ''
          e.target.value = ''
        })

      },
      _delImg(applyKey, uploadKey) {
        this.shopInfo[applyKey] = ''
        this.uploadImg[uploadKey] = ''
      },
      _checkForm() {
        if(submitting) {
          return false
        }
        let errorMsg = {
          name: '请输入供应商名称',
          province: '请选择省份',
          city: '请选择城市',
          district: '请选择区/县',
          images: '请上传营业执照',
          category_id: '请选择主营品类',
          contact: '请输入联系人',
          mobile: '请输入联系电话',
          wechat_image_id: '请上传微信二维码'
        }
        this.shopInfo.images = this.uploadCertificateList
        // for (let k in this.shopInfo) {
        //   console.log(k)
        //   if (this.shopInfo[k].map) {
        //     this.shopInfo[k].length < 1 && this.$toast.show(errorMsg[k])
        //     return this.shopInfo[k].length
        //   } else {
        //     if (!(this.shopInfo[k]+'').trim()) {
        //       this.$toast.show(errorMsg[k])
        //       return false
        //     }
        //   }
        // }
        for (let k in errorMsg) {
          let flag = this.shopInfo[k].toString().trim()
          if (!flag) {
            this.$toast.show(errorMsg[k])
            return false
          }
        }
        return true
      },
      _subApply() {
        if(!this._checkForm()) return
        submitting = true
        let images = this.shopInfo.images.map(item => item.id)
        let data = {...this.shopInfo, image_id: images}
        API.SupplierInfo.creatSupplierInfo(data, true)
          .then((res) => {
            this.subModify = true
          })
          .finally(() => {
            submitting = false
            this.$loading.hide()
          })
      },
      _goBack() {
        this.$router.back()
      },
      _goToMain() {
        this.$router.push(`/information`)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .form-image.more
    display :inline-block !important

  .apply-suppliers
    box-sizing: border-box
    position: absolute
    width: 100%
    min-height: 100%
    background: #fff
    padding-bottom: 120px
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
    padding: 0 30px
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
        bottom: 0
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
              margin-right: 10px
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

  .approve-tips-model
    position: absolute
    top: 74px
    left: 0
    bottom: 74px
    right: 0
    z-index: 101
    layout()
    align-items: center
    justify-content: center

    .tips-con
      layout()
      align-items: center
      justify-content: center

      .tips-img
        width: 114px
        height: @width

      .tips-title
        margin: 18px 0
        font-family: $font-family-medium
        font-size: 22px
        color: $color-text-main
        text-align: center
        line-height: 1

      .tips-text
        font-family: $font-family-regular
        font-size: 14px
        color: #666666
        text-align: center
        line-height: 1
  .button-con
    box-sizing: border-box
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    height: 80px
    padding-left: 163px
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
