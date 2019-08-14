<template>
  <div class="apply-suppliers">
    <div class="top-bg">
      <img src="./pic-h5top@2x.png" alt="" class="bg-img">
    </div>
    <div v-if="!subModify" class="content">
      <div class="form-con">
        <div class="form-item">
          <div class="form-title">供应商名称</div>
          <div class="form-input-box">
            <input v-model="shopInfo.name" type="text" class="form-input" placeholder="请输入供应商名称"
                   maxlength="25" @mousewheel.native.prevent
            >
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">联系人</div>
          <div class="form-input-box">
            <input v-model="shopInfo.contact" type="text" class="form-input" placeholder="请输入联系人信息"
                   maxlength="20" @mousewheel.native.prevent
            >
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">联系电话</div>
          <div class="form-input-box">
            <input v-model="shopInfo.mobile" type="text" class="form-input" placeholder="请输入联系人手机号码"
                   maxlength="11" @mousewheel.native.prevent
            >
          </div>
        </div>
        <div class="form-item" @click="_showPicker('category')">
          <div class="form-title">主营品类</div>
          <div v-if="category" class="form-input-box">{{category}}</div>
          <div v-else class="form-input-box ph-text">请选择品类</div>
          <img src="./icon-right_arrow@2x.png" class="item-arrow">
        </div>
        <div class="form-item" @click="_showPicker('city')">
          <div class="form-title">区域</div>
          <div v-if="shopInfo.province" class="form-input-box">{{shopInfo.province}} {{shopInfo.city}} {{shopInfo.district}}</div>
          <div v-else class="form-input-box ph-text">请选择区域</div>
          <img src="./icon-right_arrow@2x.png" class="item-arrow">
        </div>
        <div class="form-item  form-img-item">
          <div class="form-title">营业执照</div>
          <div class="form-image-box">
            <section class="img-con">
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
                </div>
              </article>
            </section>
            <div class="form-tip">最多可上传5张图片。</div>
          </div>
        </div>
        <div class="form-item  form-img-item">
          <div class="form-title">微信二维码</div>
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
              </div>
            </div>
            <div class="form-tip">请上传小于5MB的jpg/jpeg/png格式的图片</div>
          </div>
        </div>
        <div class="form-btn" @click="_subApply">提交申请</div>
      </div>
    </div>
    <div v-if="subModify" class="approve-tips-model">
      <div class="tips-con">
        <img src="./icon-pay_success@2x.png" class="tips-img">
        <div class="tips-title">提交申请供应商成功</div>
        <div class="tips-text">审核结果会在 48小时内 短信通知，请留意手机</div>
      </div>
    </div>
    <awesome-picker ref="categoryPicker" :data="awPickerData" @confirm="_pickerConfirm"></awesome-picker>
    <awesome-picker ref="cityPicker" :data="cityPickerData" @confirm="_cityPickerConfirm"></awesome-picker>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {uploadFiles} from '../../utils/cos/cos'
  import Draggable from 'vuedraggable'
  import CITY_JSON from 'china-division/dist/pca.json'

  const PAGE_NAME = 'APPLY_SUPPLIERS_H5'
  const TITLE = '申请成为供应商'
  let submitting = false

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      Draggable
    },
    data() {
      return {
        shopInfo: {
          name: '',
          contact: '',
          mobile: '',
          category_id: '',
          province: '',
          city: '',
          district: '',
          images: [],
          wechat_image_id: '',
        },
        uploadImg: {license:'',QRCode:''},
        uploadLoading: false,
        uploading: '',
        subModify: false,
        uploadCertificateList: [],
        cityPickerData: [],
        awPickerData: [],
        pickData: [],
        category: ''
      }
    },
    mounted() {
      this._getCategoryData()
      this._getCityData()
    },
    methods: {
      _getCityData() {
        let cityData = []
        for (let proName in CITY_JSON) {
          const _cityData = CITY_JSON[proName]
          let provinceItem = {
            value: proName,
            children: []
          }
          for (let cityName in _cityData) {
            const _areaData = _cityData[cityName]
            let cityItem = {
              value: cityName,
              children: []
            }
            _areaData.forEach((areaName) => {
              cityItem.children.push({value: areaName})
            })
            provinceItem.children.push(cityItem)
          }
          cityData.push(provinceItem)
        }
        this.cityPickerData = cityData
      },
      _getCategoryData() {
        API.GoodsManage.getCategoryData({parent_id: -1})
          .then((res) => {
            this.pickData = res.data
            let categoryArr = []
            res.data.forEach((item) => {
              let categoryItem = {
                value: item.name,
                children: [{value: ''}]
              }
              item.list.forEach((child) => {
                categoryItem.children.push({value: child.name})
              })
              categoryArr.push(categoryItem)
            })
            this.awPickerData = categoryArr
          })
      },
      _showPicker(item) {
        this.$refs[`${item}Picker`] && this.$refs[`${item}Picker`].show()
      },
      _pickerConfirm(data) {
        const firstIdx = data[0].index
        const secondIdx = data[1].index
        if (data[1].value === '') {
          this.shopInfo.category_id = this.pickData[firstIdx].id
          this.category = data[0].value
        } else {
          this.shopInfo.category_id = this.pickData[firstIdx].list[secondIdx-1].id
          this.category = data[1].value
        }
      },
      _cityPickerConfirm(data) {
        this.shopInfo.province = data[0].value
        this.shopInfo.city = data[1].value
        this.shopInfo.district = data[2].value
      },
      _addImg(applyKey, uploadKey, e) {
        this.$loading.show('图片上传中')
        this.uploading = applyKey
        this.uploadLoading = true
        uploadFiles({files: [e.target.files[0]]}).then(res => {
          this.uploadLoading = false
          const resData = res[0].data
          this.shopInfo[applyKey] = resData.id
          this.uploadImg[uploadKey] = resData.url
          this.$loading.hide()
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
        this.$loading.show('图片上传中')
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
          this.$loading.hide()
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
          contact: '请输入联系人',
          mobile: '请输入联系电话',
          category_id: '请选择主营品类',
          province: '请选择省份',
          city: '请选择城市',
          district: '请选择区/县',
          images: '请上传营业执照',
          wechat_image_id: '请上传微信二维码'
        }
        this.shopInfo.images = this.uploadCertificateList
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
    width: 100vw
    min-height: 100vh
    background: #f7f7f7
    padding: 47.466vw 16px 16px
    .top-bg
      position: absolute
      top: 0
      left: 0
      width: 100vw
      height: 54.667vw
      .bg-img
        width: 100%
        height: 100%
  .content
    position: relative
    padding: 0 15px 15px
    box-sizing: border-box
    background: #FFFFFF
    box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06)
    border-radius: 4px
    .form-con
      box-sizing: border-box
      .form-item
        layout(row)
        justify-content: space-between
        align-items: center
        color: #111111
        height: 48px
        position: relative
        &:after
          display: block
          content: ""
          position: absolute
          bottom: 0
          right: 0
          width: 100%
          transform: scaleY(.5) translateZ(0)
          border-bottom: 1px solid #e6e6e6
        .form-title
          width: 86px
          min-width: 86px
          height: 48px
          line-height: 48px
          color: #333333
          font-size: $font-size-14
          font-family: $font-family-regular
          white-space: nowrap
          text-align: left
        .form-input-box
          padding: 0 10px
          flex: 1
          position: relative
          font-size: $font-size-14
          color: #111111
          font-family: $font-family-regular
          &.ph-text
            color: #b7b7b7
        .form-input
          box-sizing: border-box
          font-size: $font-size-14
          font-family: $font-family-regular
          color: #111111
          height: 100%
          transition: all 0.3s
          &::-webkit-inner-spin-button
            appearance: none
          &::placeholder
            font-family: $font-family-regular
            color: #b7b7b7
        .item-arrow
          width: 10.5px
          height: @width
        .form-tip
          padding-top: 10px
          font-family: $font-family-regular
          font-size: 14px
          color: #ACACAC
          line-height: 1
        &.form-img-item
          height: 134px
          flex-direction: column
          align-items: flex-start
          justify-content: flex-start
          .form-image-box
            width: 100%
          .form-title
            width: 100%
            height: 46px
            line-height: 46px
          .img-con
            display: flex
            align-items: center
          .form-image
            flex-wrap: wrap
            display: flex
            .draggable
              flex-wrap: wrap
              display: flex
            .add-image
              icon-image('icon-add_img')
              height: 50px
              width: @height
              position: relative
              border-radius: 3px
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
              background-repeat: no-repeat
              background-size: cover
              background-position: center
              height: 50px
              margin-right: 2.667vw
              width: @height
              border-radius: 3px
              position: relative
              overflow: hidden
              .img
                height: 100%
            .close
              icon-image('icon-delpic')
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
      .form-btn
        width: 100%
        height: 45px
        line-height: 45px
        background: #343870
        color: #fff
        font-size: 16px
        font-family: $font-family-regular
        text-align: center
        border-radius: 2px
        opacity: 0.7
        &.active
          opacity: 1

  .approve-tips-model
    box-sizing: border-box
    position: absolute
    top: 0
    left: 0
    right: 0
    z-index: 101
    width: 100vw
    height: 100vh
    padding-top: 10.4vh
    background: #fff
    .tips-con
      layout()
      align-items: center
      justify-content: center
      color: #333333
      .tips-img
        width: 114px
        height: @width
      .tips-title
        margin: 22px 0 15px
        font-family: $font-family-medium
        font-size: 18px
        text-align: center
        line-height: 1
      .tips-text
        font-family: $font-family-regular
        font-size: 14px
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
      font-size: 14px
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
