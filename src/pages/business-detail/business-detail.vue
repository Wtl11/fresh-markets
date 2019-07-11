<template>
  <div class="goods-detail">
    <!--banner-->
    <section class="banner-wrapper">
      <img src="./pic-banner_samll@2x.png" alt="" class="banner-img">
      <img src="./pic-logo@2x.png" alt="" class="logo">
      <div class="company-detail">
        <div class="left-detail">
          <h3 class="company-name">江南皮革厂水果贸易有限公司</h3>
          <div class="context">
            <div class="text-box left-text">
              <p class="text">主营品类： 新鲜水果</p>
              <p class="text">商品数量： 100个商品</p>
              <p class="text">所在地区： 江南水乡古镇</p>
            </div>
            <div class="text-box right-text">
              <p class="text">联 系 人： 李江南</p>
              <p class="text">联系方式： 13584260103</p>
            </div>
          </div>
        </div>
        <img src="./code.png" alt="" class="qr-code">
      </div>
    </section>
    <!--橙色条-->
    <section class="top-msg">
      <div class="msg-box">
        <p class="title">全部商品</p>
        <span class="text">(已入驻<em class="num">1000</em>个商品)</span>
        <!--<span class="icon"></span>-->
      </div>
    </section>

    <!--商品推荐-->
    <section class="goods-recommend">
      <div class="goods-list">
        <div v-for="(item, index) in goodsList" :key="index" class="goods-item-box">
          <goods-item></goods-item>
        </div>
      </div>
      <div class="pagination">
        <goods-pagination @addPage="addPage"></goods-pagination>
      </div>
    </section>

    <div class="bottom"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import GoodsItem from '@components/goods-item/goods-item'
  import GoodsPagination from '@components/goods-pagination/goods-pagination'
  const PAGE_NAME = 'BUSINESS_DETAIL'
  const TITLE = '商家信息'


  const IMAGE_LIST = ['a', 'b', 'c', 'd', 'e']
  const GOODS_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      GoodsItem,
      GoodsPagination
    },
    data() {
      return {
        imageList: IMAGE_LIST,
        goodsList: GOODS_LIST,
        bigImageUrl: 'a'
      }
    },
    beforeRouteEnter(to, from, next) {next()},
    created() {
    },
    methods: {
      changeImage(item) {
        this.bigImageUrl = item
      },
      addPage(page) {
        console.log(page)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $maxWidth = 1920px
  $minWidth = 1400px

  .goods-detail
    width: 100%
    background: #F8F8F8
  .banner-wrapper
    margin: 0 auto
    max-width: $maxWidth
    min-width: $minWidth
    height: 380px
    position: relative
    font-size: 16px;
    color: #FFFFFF;
    line-height: 1
    .banner-img
      width: 100%
      height: 100%
      object-fit: cover
    .logo
      width: 160px
      height: 58px
      position: absolute
      left: 130px
      top: 50px
    .company-detail
      width: 1020px
      height: 206px
      padding: 24px 30px
      box-sizing: border-box
      display: flex
      align-items: center
      position: absolute
      left: 130px
      bottom: 36px
      background-image: linear-gradient(270deg, rgba(39,39,39,0.00) 16%, rgba(17,17,17,0.72) 93%)
      border-radius: 8px
    .left-detail
      width: 622px
      padding-bottom: 20px
    .company-name
      font-size: 32px
      color: $color-white
      font-family: $font-family-medium
    .context
      margin-top: 25px
      display: flex
    .text-box
      padding-right: 90px
    .text
      margin-bottom: 14px
      font-size: 14px
      color: $color-white
      font-family: $font-family-regular
    .qr-code
      width: 120px
      height: 120px
  .top-msg
    max-width: $maxWidth
    min-width: $minWidth
    margin: 0 auto
    background: #FF520F
    height: 60px
    .msg-box
      width: $minWidth
      margin: 0 auto
      height: 60px
      display: flex
      align-items: center
      color: #ffffff
      font-family: $font-family-regular
    .title
      font-size: 20px
      margin-top: -5px
    .text
      font-size: $font-size-14
      .num
        font-style: normal
        font-family: $font-family-medium
        font-size: $font-size-16
    .icon
      width: 22px
      height: 22px
      margin-left: 14px
      icon-image(icon-Jump)
      &:hover
        icon-iamge(icon-Jump_hover)


  .goods-recommend
    width: $minWidth
    margin: 20px auto 0
    .page-title
      padding: 20px 15px
      margin-bottom: 20px
      font-family: $font-family-medium
      color: #333333
      font-size: $font-size-20
      border-bottom: 1px solid $color-line
      position: relative
      &:before
        content: ""
        width: 4px
        height: 17px
        background: #FF520F
        col-center()
        left: 0
    .goods-list
      overflow: hidden
    .goods-item-box
      width: 225px
      height: 350px
      float: left
      margin-right: 10px
      margin-bottom: 20px
      &:nth-child(6n)
        margin-right: 0
    .pagination
      margin-top: 20px
  .bottom
    padding-bottom: 48px
</style>
