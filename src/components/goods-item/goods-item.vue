<template>
  <div class="goods-item hand" @click="clickHandle">
    <div class="img-box">
      <img v-if="lazyload && goodsInfo.goods_cover_image" class="lazy-goods-img" src="./loading.png" :lazy-src="goodsInfo.goods_thumb_image" alt="">
      <img v-if="!lazyload && goodsInfo.goods_cover_image" class="goods-img" :src="goodsInfo.goods_thumb_image" alt="">
    </div>
    <div class="msg-box">
      <p v-if="goodsInfo.purchase_price >= 0" class="price-txt"><span class="price-icon">¥</span>{{goodsInfo.purchase_price}}</p>
      <p v-else class="un-price">登录查看采购价</p>
      <p class="goods-title">{{goodsInfo.name}}</p>
      <p class="goods-tag">
        <span v-for="(tag, index) in goodsInfo.delivery_method" :key="index" class="tag-text">{{+tag === 1 ? '一件代发' : '区域发货'}}</span>
      </p>
      <div v-if="showCompany" class="company-msg">
        <img class="company-icon" src="./icon-supplier_gary@2x.png" alt="">
        <span class="company-txt">{{supplierName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {authComputed} from '@state/helpers'
  export default {
    name: 'GoodsItem',
    props: {
      showCompany: {
        type: Boolean,
        default: true
      },
      goodsInfo: {
        type: Object,
        default: () => {}
      },
      lazyload: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        timerRun: false
      }
    },
    computed: {
      ...authComputed,
      supplierName() {
        const supplier = this.goodsInfo.supplier || {}
        return supplier.name || ''
      }
    },
    methods: {
      clickHandle() {
        if (!this.tokenInformation) {
          this.$emit('toLogin', this.goodsInfo)
          return
        }
        let routeUrl = this.$router.resolve({
          path: '/goods-detail',
          query: {goodsId: this.goodsInfo.id, supplierId: this.goodsInfo.supplier_id}
        })
        window.open(routeUrl.href, '_blank')
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-item
    width: 100%
    height: 100%
    box-sizing: border-box
    overflow: hidden
    border: 1px solid #ECECEC
    border-radius: 2px
    display: flex
    flex-direction: column

    .img-box
      width: 223px
      height: 223px
      overflow: hidden
      position: relative
      .lazy-goods-img,.goods-img
        width: 100%
        height: 100%
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
        transition: all .3s
        object-fit :cover
    .msg-box
      flex: 1
      background: $color-white
      padding: 13px 14px 0
      display: flex
      flex-direction: column
      .un-price
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4D77BD;
        line-height: 20px;
      .price-txt
        font-family: PingFangSC-Medium
        font-size: 20px
        color: #FF520F
        .price-icon
          font-size: 14px
          margin-right: 2px
      .goods-title
        margin: 10px 0
        height :36px
        box-sizing :border-box
        font-family: PingFangSC-Regular
        font-size: 14px
        line-height: 18px
        color: #333333
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        word-break: break-all
        -webkit-line-clamp:2
        -webkit-box-orient: vertical
      .goods-tag
        display: flex
        align-items: center
        height: 22px
        margin-bottom: 10px
        flex: 1
        .tag-text
          color: #FF520F
          font-size: $font-size-12
          font-family: $font-family-regular
          border: 1px solid #FF520F
          width: 64px
          height: 22px
          text-align: center
          line-height: 22px
          margin-right: 6px
      .company-msg
        flex: 1
        display: flex
        align-items: center
        height: 35px
        border-top: 1px dashed #ECECEC
        .company-icon
          width: 16px
          height: 16px
          margin-right: 6px
        .company-txt
          flex: 1
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          font-family: PingFangSC-Regular
          font-size: 14px
          line-height: 16px
          color: #999999
    &:hover
      border: 1px solid #FF520F
      .img-box .goods-img,.img-box .lazy-goods-img
        width: 232px
        height: 232px
  .test
    height: 10px


</style>
