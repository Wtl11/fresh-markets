<template>
  <div class="goods-detail">
    <!--banner-->
    <section class="banner-wrapper">
      <img src="./pic-banner_samll@2x.png" alt="" class="banner-img">
      <div class="banner-w">
        <img src="./pic-logo@2x.png" alt="" class="logo hand" @click="$router.push('/')">
        <div class="company-detail">
          <div class="left-detail">
            <h3 class="company-name">{{supplierDetail.name}}</h3>
            <div class="context">
              <div class="text-box left-text">
                <p class="text">主营品类： {{supplierDetail.goods_material_category}}</p>
                <p class="text">商品数量： {{supplierDetail.goods_num || 0}}个商品</p>
                <p class="text">所在地区： {{supplierDetail.province}}{{supplierDetail.city}}{{supplierDetail.district}}</p>
              </div>
              <div class="text-box right-text">
                <p class="text">联 系 人： {{supplierDetail.contact}}</p>
                <p class="text">联系方式： {{supplierDetail.mobile}}</p>
              </div>
            </div>
          </div>
          <img :src="supplierDetail.wechat_image_url" alt="" class="qr-code">
        </div>
      </div>
    </section>
    <!--橙色条-->
    <section class="top-msg">
      <div class="msg-box">
        <div class="msg-content hand" @click="goBusiness">
          <p class="title">全部商品</p>
          <span class="text">(已入驻<em class="num">{{supplierDetail.goods_num || 0}}</em>个商品)</span>
          <span class="icon"></span>
        </div>
      </div>
    </section>
    <!--商品信息-->
    <section class="goods-msg">
      <h2 class="goods-title">{{goodsDetail.name}}</h2>
      <div class="msg-content">
        <div class="goods-image-box">
          <img :src="bigImageUrl || (imageList[0] && imageList[0].image_url)" alt="" class="goods-image">
          <div class="image-list">
            <img
              v-for="(image, index) in imageList"
              :key="index"
              :src="image && image.image_url"
              alt=""
              class="image-item hand"
              @click="changeImage(image)"
            >
          </div>
        </div>
        <div class="goods-msg-box">
          <div class="top-context">
            <p class="price">
              <span class="label">价格</span>
              <span class="num"><em class="sign">¥</em>{{goodsDetail.purchase_price || '0.00'}}</span>
            </p>
            <p class="condition">
              <span class="label">起批量</span>
              <span class="text">≥ {{supplierDetail.goods_start_num || 0}}</span>
            </p>
          </div>
          <div class="bottom-context">
            <p class="deal">
              <span class="label">成交</span>
              <span class="text">共成交 <em class="number">{{goodsDetail.goods_success_num || 0}}</em> 件商品</span>
            </p>
            <p class="safe">
              <span class="label">实力保障</span>
              <span class="bottom-text">
                <img src="./icon-meng@2x.png" alt="" class="icon">
                赞播联盟
                <img src="./icon-good@2x.png" alt="" class="icon">
                优质供应商
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!--商品详情-->
    <section class="goods-detail-image">
      <h3 class="page-title">商品详情</h3>
      <img v-for="(image, index) in detailList" :key="index" :src="image && image.image_url" alt="" class="image">
    </section>

    <!--商品推荐-->
    <section v-if="goodsList.length" class="goods-recommend">
      <h3 class="page-title">其他商品</h3>
      <div class="goods-list">
        <div v-for="(item, index) in goodsList" :key="index" class="goods-item-box">
          <goods-item :goodsInfo="item"></goods-item>
        </div>
      </div>
    </section>

    <div class="bottom"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import GoodsItem from '@components/goods-item/goods-item'
  const PAGE_NAME = 'GOODS_DETAIL'
  const TITLE = '商品详情'

  export default {
    name: PAGE_NAME,
    page() {
      return {
        title: this.goodsDetail.name || TITLE
      }
    },
    components: {
      GoodsItem
    },
    data() {
      return {
        imageList: [],
        goodsList: [],
        detailList: [],
        bigImageUrl: '',
        goodsId: '',
        supplierId: '',
        goodsDetail: {},
        supplierDetail: {}
      }
    },
    beforeRouteEnter(to, from, next) {
      next()
    },
    created() {
      this.goodsId = this.$route.query.goodsId || 0
      this.supplierId = this.$route.query.supplierId || 0
      this.getGoodsDetail()
      this.getSupplierDetail()
      this.getGoodsList()
    },
    methods: {
      getGoodsDetail() {
        API.GoodsDetail.getGoodsDetail(this.goodsId).then((res) => {
          this.goodsDetail = res.data
          this.imageList = res.data.goods_main_images
          this.detailList = res.data.goods_detail_images
        })
      },
      getSupplierDetail() {
        API.GoodsDetail.getSupplierDetail(this.supplierId).then((res) => {
          this.supplierDetail = res.data
        })
      },
      // 获取列表
      getGoodsList() {
        API.GoodsDetail.getGoodsList({page: 1, limit: 12, supplier_id: this.supplierId, no_goods_supplier_id: this.goodsId}, false).then((res) => {
          this.goodsList = res.data
        })
      },
      changeImage(item) {
        this.bigImageUrl = item.image_url
      },
      goBusiness() {
        this.$router.push(`/business-detail?supplierId=${this.supplierId}`)
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
    .banner-w
      width: $minWidth
      height: 380px
      row-center()
      top: 0
    .banner-img
      width: 100%
      height: 100%
      object-fit: cover
    .logo
      width: 160px
      height: 58px
      position: absolute
      left: 0
      top: 50px
    .company-detail
      width: 1020px
      height: 206px
      padding: 24px 30px
      box-sizing: border-box
      display: flex
      align-items: center
      position: absolute
      left: 0
      bottom: 36px
      background-image: linear-gradient(270deg, rgba(39,39,39,0.00) 16%, rgba(17,17,17,0.72) 93%)
      border-radius: 8px
    .left-detail
      width: 622px
      height: 100%
    .company-name
      margin-top: 8px
      font-size: 32px
      color: $color-white
      font-family: $font-family-medium
    .context
      margin-top: 25px
      display: flex
    .text-box
      flex: 1
      overflow: hidden
      padding-right: 90px
    .text
      margin-bottom: 12px
      font-size: 14px
      line-height: 20px
      color: $color-white
      white-space: nowrap
      font-family: $font-family-regular
    .right-text
      padding-right: 0
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
      color: #ffffff
      display: flex
      font-family: $font-family-regular
    .msg-content
      display: flex
      align-items: center
      height: 60px
      &:hover .icon
        icon-image(icon-Jump_hover)
    .title
      font-size: 20px
      margin-top: -5px
    .text
      margin-left: 4px
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
      transition: all 0.2s

  .goods-msg
    width: $minWidth
    margin: 0 auto
    .goods-title
      font-size: $font-size-18
      color: #333333
      font-family: $font-family-regular
      padding: 20px 0
    .msg-content
      display: flex
    .goods-image-box
      width: 400px
      .goods-image
        width: 400px
        height: 400px
        object-fit: cover
        background: #ffffff
      .image-list
        width: 402px
        padding: 0 12px
        box-sizing: border-box
        height: 66px
        margin-top: 17px
      .image-item
        width: 66px
        height: 66px
        float: left
        object-fit: cover
        margin-right: 12px
        background: #ffffff
        &:last-child
          margin-right: 0
    .goods-msg-box
      margin-left: 20px
      .top-context
        background: #F8EEEE
        padding: 20px 20px 30px
        width:  970px
        height: 129px
        display: flex
        flex-direction: column
        justify-content: space-between
        box-sizing: border-box
      .price,.condition,.deal,.safe
        display: flex
        align-items: center
      .label
        font-size: $font-size-14
        font-family: $font-family-regular
        width: 142px
        color: #333
      .num
        font-size: 28px
        font-family: $font-family-medium
        color: #ff520f
      .sign
        font-style: normal
        margin-right: 2px
        font-size: $font-size-16
      .text
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #333
      .number
        font-style: normal
        font-family: $font-family-medium
        font-size: $font-size-16
        color: #ff520f
      .icon
        width: 18px
        height: 18px
        margin-right: 2px
        margin-left: 40px
        &:first-child
          margin-left: 0
      .bottom-context
        padding: 20px 20px 30px
        box-sizing: border-box
        height: 119px
        display: flex
        flex-direction: column
        justify-content: space-between
        border-bottom: 1px solid $color-line
      .bottom-text
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #333
        display: flex
        align-items: center



  .goods-detail-image
    width: $minWidth
    margin: 10px auto 0
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
    .image
      width: 790px
      display: block
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
  .bottom
    padding-bottom: 30px
</style>
