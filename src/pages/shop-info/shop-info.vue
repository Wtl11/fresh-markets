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
            <city-select ref="city" :height="44" :width="195" @setValue="_setCityValue"></city-select>
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
                   disabled maxlength="29" @mousewheel.native.prevent
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
      <div v-if="subModify" class="approve-tips-model">
        <div class="tips-con">
          <img src="./icon-success@2x.png" class="tips-img">
          <div class="tips-title">提交审核成功，请耐心等待</div>
          <div class="tips-text">审核结果后会在72小时内以短信形式通知您，请留意手机</div>
        </div>
      </div>
    </div>
    <div v-if="!subModify" class="button-con">
      <div :class="approveStatus * 1 === 0?'disable':''" class="hand button confirm" @click="_subModify">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import * as Helpers from './helpers'
  import API from '@api'
  import {uploadFiles} from '../../utils/cos/cos'
  import CitySelect from './city-select/city-select'
  const PAGE_NAME = 'SHOP_INFO'
  const TITLE = '店铺信息'
  let submitting = false
  let shopId = ''

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      CitySelect
    },
    data() {
      return {
        shopInfo: {
          name: '',
          province: '',
          city: '',
          district: '',
          image_id: '',
          goods_start_num: '',
          category_id: '',
          contact: '',
          mobile: '',
          wechat_image_id: ''
        },
        firstSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        uploadImg: {license: '', QRCode: ''},
        uploadLoading: false,
        uploading: '',
        approveStatus: 1,
        subModify: false
      }
    },
    beforeRouteEnter(to, from, next) {
      API.SupplierInfo.getSupplierInfo().then((res) => {
        next((vw) => {
          vw._setSupplierInfo(res.data)
        })
      }).catch(() => {
        next((vw) => {
          vw.$loading.hide()
        })
      })
    },
    methods: {
      _setSupplierInfo(resData) {
        shopId = resData.id
        this._getCategoryData()
        this.approveStatus = resData.approve_status
        this.shopInfo = {
          name: resData.name,
          province: resData.province,
          city: resData.city,
          district: resData.district,
          image_id: resData.image_id,
          goods_start_num: resData.goods_start_num,
          category_id: resData.category_id,
          contact: resData.contact,
          mobile: resData.mobile,
          wechat_image_id: resData.wechat_image_id
        }
        this.uploadImg = {license: resData.image_url, QRCode: resData.wechat_image_url}
        this.$refs.city.infoCity([this.shopInfo.province, this.shopInfo.city, this.shopInfo.district])
      },
      _getCategoryData() {
        API.GoodsManage.getCategoryData({parent_id: -1, supplier_id: shopId}).then((res) => {
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
        this.shopInfo[key] = data.id
        if (childKey) {
          this[childKey].data = data.list
          this[childKey].content = '二级类目'
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
        uploadFiles({files: [e.target.files[0]]}).then((res) => {
          this.uploadLoading = false
          const resData = res[0].data
          this.shopInfo[applyKey] = resData.id
          this.uploadImg[uploadKey] = resData.url
        }).catch(() => {
          this.uploadLoading = false
        })
        e.target.value = ''// 清除选择的图片，否则同一个图片无法再次上传
      },
      _delImg(applyKey, uploadKey) {
        this.shopInfo[applyKey] = ''
        this.uploadImg[uploadKey] = ''
      },
      _checkForm() {
        if (this.approveStatus === 0 || submitting) {
          return false
        }
        submitting = true
        let errorMsg = {
          name: '请输入供应商名称',
          province: '请选择省份',
          city: '请选择城市',
          district: '请选择区/县',
          image_id: '请上传营业执照',
          goods_start_num: '请输入商品起批量',
          category_id: '请选择主营品类',
          contact: '请输入联系人',
          mobile: '请输入联系电话',
          wechat_image_id: '请上传微信二维码'
        }
        for (let k in this.shopInfo) {
          if (!(this.shopInfo[k] + '').trim()) {
            this.$toast.show(errorMsg[k])
            return false
          }
        }
        return true
      },
      _subModify() {
        if (!this._checkForm()) {
          submitting = false
          return
        }
        API.SupplierInfo.editSupplierInfo(this.shopInfo, true, shopId)
          .then((res) => {
            submitting = false
            this.$toast.show('保存成功!')
            // this.subModify = true
          })
          .catch(() => {
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
    position: relative
    width: 100%
    background: #fff
    border: 1px solid #E9ECF0
    border-radius: 4px
    padding-bottom: 80px
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
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 100%
      height: 100%
      background: #fff
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
