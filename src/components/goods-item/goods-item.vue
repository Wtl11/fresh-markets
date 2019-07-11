<template>
  <div class="goods-item hand">
    <div class="img-box">
      <img v-if="goodsInfo.goods_cover_image" class="goods-img" :src="goodsInfo.goods_cover_image" alt="">
    </div>
    <div class="msg-box">
      <p class="price-txt"><span class="price-icon">¥</span>{{goodsInfo.purchase_price}}</p>
      <p class="goods-title">{{goodsInfo.name}}</p>
      <div v-if="showCompany" class="company-msg">
        <img class="company-icon" src="./icon-supplier_gary@2x.png" alt="">
        <span class="company-txt">{{supplierName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
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
      }
    },
    data() {
      return {
      }
    },
    computed: {
      supplierName() {
        const supplier = this.goodsInfo.supplier || {}
        return supplier.name || ''
      }
    }
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
      .goods-img
        width: 100%
        height: 100%
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
        transition: all .3s
    .msg-box
      flex: 1
      background: $color-white
      padding: 13px 14px 0
      display: flex
      flex-direction: column
      .price-txt
        font-family: PingFangSC-Medium
        font-size: 20px
        color: #FF520F
        .price-icon
          font-size: 14px
          margin-right: 2px
      .goods-title
        margin: 10px 0
        font-family: PingFangSC-Regular
        font-size: 14px
        line-height: 18px
        color: #333333
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp:2
        -webkit-box-orient: vertical

      .company-msg
        flex: 1
        display: flex
        align-items: center
        border-top: 1px solid #ECECEC
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
          color: #999999
    &:hover
      border: 1px solid #FF520F
      .img-box .goods-img
        width: 232px
        height: 232px
  .test
    height: 10px


</style>
