<template>
  <div class="market-info">
    <section class="left-wrapper">
      <div class="l-header">
        <img src="./icon-supplier_orange@2x.png" alt="" class="icon">
        <span class="name">水果供应商公示时间</span>
      </div>
      <section class="l-body">
        <dl class="content-wrapper">
          <dd class="info-item-wrapper">
            <span class="key">主营品类：</span>
            <span class="value">新鲜水果</span>
          </dd>
          <dd class="info-item-wrapper">
            <span class="key">商品数量：</span>
            <span class="value">新鲜水果</span>
          </dd>
          <dd class="info-item-wrapper">
            <span class="key">所在地区：</span>
            <span class="value">广东省广州市</span>
          </dd>
          <dd class="info-item-wrapper">
            <span class="key">联  系 人：</span>
            <span class="value">新鲜水果</span>
          </dd>
          <dd class="info-item-wrapper">
            <span class="key">联系方式：</span>
            <span class="value">新鲜水果</span>
          </dd>
          <dt class="qr-code-wrapper">
            <span class="key">微信二维码:</span>
            <img src="http://www.oppein.cn/updata/uploads/201702/58aa85f323e2e.jpg" alt="" class="qr-code">
          </dt>
        </dl>
        <button class="button">进入店铺 >></button>
      </section>
    </section>
    <section class="right-wrapper">
      <goods-item class="goods-item-wrapper"></goods-item>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import GoodsItem from '@components/goods-item/goods-item'

  const COMPONENT_NAME = 'MARKET_INFO'

  export default {
    name: COMPONENT_NAME,
    components: {
      GoodsItem
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .market-info
    height :341px
    width :100%
    box-sizing :border-box
    padding :14px 14px 14px 20px
    border :1px solid $color-line
    background :#fff
    display :flex
    .right-wrapper
      display :flex
      .goods-item-wrapper
        height :100%
        width :225px
    .left-wrapper
      font-family: $font-family-regular
      font-size: 14px;
      color: #151515;
      line-height :1
      width :671px
      .l-body
        width :591px
        margin :60px auto
        .content-wrapper
          width :100%
          height :167px
          display :flex
          flex-direction: column
          flex-wrap : wrap
          .qr-code-wrapper
            height :100%
            display :flex
            flex: 1
            flex-direction column
            align-items :center
            text-align :center
            .key
              color: #999
              padding-bottom :10px
            .qr-code
              width: 70px
              height: 70px
              background: #FFFFFF;
              border: 1px solid #ECECEC;
              border-radius: 2px;
              overflow :hidden
              display :inline-block
          .info-item-wrapper
            width : 256px
            padding-bottom :30px
            .key
              width :70px
              color: #999
        .button
          cursor :pointer
          height :44px
          width :100%
          background-image: linear-gradient(270deg, #FF7822 0%, #FF520F -99%);
          border-radius: 4px;
          color: #fff
      .l-header
        display :flex
        overflow :hidden
        align-items :center
        line-height :1
        .icon
          width :19px
          height: 20px
        .name
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #333333;
          padding-left :10px
</style>
