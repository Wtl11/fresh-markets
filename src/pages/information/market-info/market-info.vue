<template>
  <div class="market-info">
    <section class="left-wrapper">
      <div class="l-header">
        <img src="./icon-supplier_orange@2x.png" alt="" class="icon">
        <span class="name">{{marketInfo.name}}</span>
      </div>
      <section class="l-body">
        <dl class="content-wrapper">
          <dd class="info-item-wrapper">
            <span class="key">主营品类：</span>
            <span class="value">{{marketInfo.goods_material_category}}</span>
          </dd>
          <dd class="info-item-wrapper">
            <span class="key">商品数量：</span>
            <span class="value">{{marketInfo.goods_num}}</span>
          </dd>
          <dd class="info-item-wrapper">
            <span class="key">所在地区：</span>
            <span class="pos area-wrapper">{{areas}}</span>
          </dd>
          <dd class="info-item-wrapper short-width">
            <span class="key">联  系 人：</span>
            <span class="value">{{marketInfo.contact}}</span>
          </dd>
          <dd class="info-item-wrapper short-width">
            <span class="key">联系方式：</span>
            <span class="value">{{marketInfo.mobile}}</span>
          </dd>
          <dt class="qr-code-wrapper">
            <span class="key">微信二维码:</span>
            <img :src="marketInfo.wechat_image_url" alt="" class="qr-code" @click="qrCodeHandle">
          </dt>
        </dl>
        <button class="button" @click.stop="navHandle">进入店铺 >></button>
      </section>
    </section>
    <section v-if="goodsList.length" class="right-wrapper">
      <template
        v-for="(item, index) in goodsList"
      >
        <goods-item
          v-if="index<3"
          :key="index"
          :showCompany="false"
          :goodsInfo="item"
          class="goods-item-wrapper"
          @toLogin="toLogin"
        ></goods-item>
      </template>

    </section>
    <section v-else class="right-wrapper empty">
      <img src="../pic-kong@3x.png" alt="" class="e-image">
      <span class="e-text">暂无商品</span>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import GoodsItem from '@components/goods-item/goods-item'
  import {authComputed} from '@state/helpers'

  const COMPONENT_NAME = 'MARKET_INFO'

  export default {
    name: COMPONENT_NAME,
    components: {
      GoodsItem
    },
    props: {
      marketInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {}
    },
    computed: {
      ...authComputed,
      areas() {
        return this.marketInfo.province + this.marketInfo.city + this.marketInfo.district
      },
      goodsList() {
        return this.marketInfo.goods_list || []
      }
    },
    methods: {
      navHandle() {
        // if (!this.tokenInformation) {
        //   this.toLogin()
        //   return
        // }
        let routeUrl = this.$router.resolve({
          path: '/business-detail',
          query: {supplierId: this.marketInfo.id}
        })
        window.open(routeUrl.href, '_blank')
      },
      qrCodeHandle() {
        if (!this.tokenInformation) {
          this.toLogin()
          return
        }
        window.open(this.marketInfo.wechat_image_url, '_blank')
      },
      toLogin(item) {
        this.$emit('toLogin', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .market-info
    height :380px
    width :100%
    box-sizing :border-box
    padding :14px 14px 14px 20px
    border :1px solid $color-line
    background :#fff
    display :flex
    .empty
      display :flex
      flex-direction column
      justify-content :center
      align-items :center
      width :100%
      height :100%
      .e-image
        width 160px
        height: 152px
      .e-text
        padding-top :20px
        font-family: $font-family-regular;
        font-size: 14px;
        color: #808080;
        text-align: center;
        line-height: 14px
    .right-wrapper
      display :flex
      flex: 1
      .goods-item-wrapper
        height :100%
        width :225px
        margin-right :10px
        cursor :pointer
        &:last-child
          margin-right :0
    .left-wrapper
      font-family: $font-family-regular
      font-size: 14px;
      color: #151515;
      line-height :1
      width :671px
      .l-body
        width :591px
        margin-top :60px
        margin-left: 31px;
        box-sizing :border-box
        .content-wrapper
          width :100%
          height :167px
          display :flex
          flex-direction: column
          flex-wrap : wrap
          .qr-code-wrapper
            height :100%
            display :flex
            flex-direction column
            align-items :center
            text-align :center
            padding-right :16px
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
              cursor :pointer
              object-fit:cover
          .info-item-wrapper
            width : 254px
            padding-bottom :30px
            position :relative
            user-select :text
            display :flex
            &.short-width
              width :240px
            .key
              width :70px
              color: #999
            .value
              flex :1
              no-wrap()
            .pos
              position absolute
            .area-wrapper
              height :100%
              top:-3px
              left :70px
              width :400px
              line-height :1.4
        .button
          cursor :pointer
          height :44px
          width :100%
          background-image: linear-gradient(270deg, #FF7822 0%, #FF520F -99%);
          border-radius: 4px;
          color: #fff
          transition : all 0.3s
          opacity :1
          &:hover
            opacity :0.7

      .l-header
        display :flex
        overflow :hidden
        align-items :center
        line-height :1
        padding-top :16px
        .icon
          width :19px
          height: 20px
        .name
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #333333;
          padding-left :10px
</style>
