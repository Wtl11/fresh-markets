<template>
  <div class="shop-info">
    <div class="item">
      <label>供应商名称</label>
      <input v-model="shopInfo.name" type="text" class="edit-input" maxlength="29">
    </div>
    <div class="item">
      <label>区域</label>
      <base-drop-down :height="40" :width="190" :select="provinceSelect" @setValue="setSelectValue($event, 'province')"></base-drop-down>
      <base-drop-down :height="40" :width="190" :select="citySelect" @setValue="setSelectValue($event, 'city')"></base-drop-down>
      <base-drop-down :height="40" :width="190" :select="areaSelect" @setValue="setSelectValue($event, 'area')"></base-drop-down>
    </div>
    <div class="item">
      <label>营销执照</label>
      <input type="file"
             class="sendImage hand"
             multiple="multiple"
             accept="image/*"
             @change="_addPic('img', picNum, $event)"
      >
    </div>
    <div class="item">
      <label>商品起批量</label>
      <input v-model="shopInfo.count" type="text" class="edit-input" placeholder="请输入起批量件数" maxlength="9">
    </div>
    <div class="item">
      <label>主营品类</label>
      <base-drop-down :height="40" :width="190" :select="firstSelect" @setValue="setSelectValue($event, 'first')"></base-drop-down>
      <base-drop-down :height="40" :width="190" :select="secondSelect" @setValue="setSelectValue($event, 'second')"></base-drop-down>
    </div>
    <div class="item">
      <label>联系人</label>
      <input v-model="shopInfo.user" type="text" class="edit-input" placeholder="请输入联系人信息" maxlength="9">
    </div>
    <div class="item">
      <label>联系方式</label>
      <input v-model="shopInfo.type" type="text" class="edit-input" placeholder="请输入联系方式" maxlength="11">
    </div>
    <div class="item">
      <label>微信二维码</label>
      <input type="file"
             class="sendImage hand"
             multiple="multiple"
             accept="image/*"
             @change="_addPic('img', 5, $event)"
      >
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  const PAGE_NAME = 'SHOP_INFO'
  const TITLE = '店铺信息'
  const SHOP_INFO = {
    name: '',
    count: 0,
    user: '',
    type: ''
  }
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
        shopInfo: SHOP_INFO,
        provinceSelect: {check: false, show: false, content: '请选择省份', type: 'default', data: SELECT_TEST},
        citySelect: {check: false, show: false, content: '请选择城市', type: 'default', data: SELECT_TEST},
        areaSelect: {check: false, show: false, content: '请选择区/县', type: 'default', data: SELECT_TEST},
        firstSelect: {check: false, show: false, content: '一级类目', type: 'default', data: SELECT_TEST},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: SELECT_TEST},
      }
    },
    methods: {
      _addPic(type, length, e) {
        this.uploadImg = type
        let arr = Array.from(e.target.files)
        e.target.value = ''
        if (arr.length < 1) return
        if (this.msg[type].length) {
          arr = arr.slice(0, length - this.msg[type].length)
        } else {
          arr = arr.slice(0, length)
        }
        this.showLoading = true
        this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
          this.showLoading = false
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
          this.$set(this.msg, type, this.msg[type].concat(imagesArr))
        })
      },
      setSelectValue(data, key) {
        this.shopInfo[key] = data.id
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .shop-info
    width: 100%
</style>
