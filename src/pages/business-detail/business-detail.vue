<template>
  <div class="goods-detail">
    <!--banner-->
    <section class="banner-wrapper">
      <img src="./pic-banner_samll.png" alt="" class="banner-img">
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
          <img :src="supplierDetail.wechat_image_url" alt="" class="qr-code hand" @click="qrCodeHandle">
        </div>
      </div>
    </section>
    <!--橙色条-->
    <section class="top-msg">
      <div class="msg-box">
        <div class="msg-content">
          <p class="title">全部商品</p>
          <span class="text">(已入驻 <em class="num">{{supplierDetail.goods_num || 0}}</em> 个商品)</span>
          <!--<span class="icon"></span>-->
        </div>
      </div>
    </section>

    <!--商品推荐-->
    <section class="goods-recommend">
      <div v-if="goodsList.length" class="goods-list">
        <div v-for="(item, index) in goodsList" :key="index" class="goods-item-box">
          <goods-item :goodsInfo="item" :lazyload="true" @toLogin="toLoginHandle"></goods-item>
        </div>
      </div>
      <div v-if="pageDetail.total_page > 1" class="pagination">
        <goods-pagination ref="pagination" :pagination="page" :pageDetail="pageDetail" @addPage="addPage"></goods-pagination>
      </div>
      <div v-if="!goodsList.length && loaded" class="no-data">
        <img src="./pic-kong@2x.png" alt="" class="no-image">
        <p class="no-text">暂无商品</p>
      </div>
    </section>
    <information-login ref="login" @refresh="refreshHandle"></information-login>
    <div class="bottom"></div>
    <common-footer></common-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import GoodsItem from '@components/goods-item/goods-item'
  import GoodsPagination from '@components/goods-pagination/goods-pagination'
  import CommonFooter from '@components/common-footer/common-footer'
  import InformationLogin from '@components/information-login/information-login'
  import {authComputed} from '@state/helpers'

  const PAGE_NAME = 'BUSINESS_DETAIL'
  const TITLE = '商家信息'

  export default {
    name: PAGE_NAME,
    page() {
      return {
        title: this.supplierDetail.name || TITLE
      }
    },
    components: {
      GoodsItem,
      GoodsPagination,
      CommonFooter,
      InformationLogin
    },
    data() {
      return {
        goodsList: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        bigImageUrl: '',
        supplierId: '',
        page: 1,
        loaded: false,
        supplierDetail: {}
      }
    },
    computed: {
      ...authComputed,
    },
    beforeRouteEnter(to, from, next) {
      next()
    },
    created() {
      this.supplierId = this.$route.query.supplierId || 0
      this.getSupplierDetail()
      this.getGoodsList()
    },
    mounted() {
      window.addEventListener('scroll', this.lazyload, false)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.lazyload, false)
    },
    methods: {
      lazyload() {
        if (!this.timerRun) {
          this.timerRun = true
          setTimeout(() => {
            const imgs = document.querySelectorAll('.lazy-goods-img')
            const viewHeight = window.innerHeight || document.documentElement.clientHeight
            let num = 0
            for (let i = num; i < imgs.length; i++) {
              let distance = viewHeight - imgs[i].getBoundingClientRect().top
              if (distance >= 0) {
                imgs[i].src = imgs[i].getAttribute('lazy-src')
                num = i + 1
              }
            }
            // if (num === imgs.length) {
            //   window.removeEventListener('scroll', this.lazyload, false)
            // }
            this.timerRun = false
          }, 100)
        }
      },
      loadImage() {
        let imgs = document.querySelectorAll('.lazy-goods-img')
        let viewHeight = window.innerHeight || document.documentElement.clientHeight
        let num = 0
        for (let i = num; i < imgs.length; i++) {
          let distance = viewHeight - imgs[i].getBoundingClientRect().top
          if (distance >= 0) {
            imgs[i].src = imgs[i].getAttribute('lazy-src')
            num = i + 1
          }
        }
      },
      qrCodeHandle() {
        if (!this.tokenInformation) {
          this.$refs.login && this.$refs.login.show()
        }

      },
      toLoginHandle(item) {
        this.$refs.login && this.$refs.login.show(item)
      },
      refreshHandle() {
        this.getSupplierDetail()
        this.getGoodsList()
      },
      getSupplierDetail() {
        API.GoodsDetail.getSupplierDetail(this.supplierId).then((res) => {
          this.supplierDetail = res.data
        })
      },
      // 获取列表
      getGoodsList() {
        API.GoodsDetail.getGoodsList({page: this.page, limit: 24, supplier_id: this.supplierId}, false).then((res) => {
          this.goodsList = res.data
          let statePageTotal = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          this.loaded = true
          this.pageDetail = statePageTotal
          this.$nextTick(() => {
            this.loadImage()
          })
        })
      },
      addPage(page) {
        this.page = page
        window.scrollTo(0, 380)
        this.getGoodsList()
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
    min-height: 100vh
    background: #F8F8F8
  .banner-wrapper
    margin: 0 auto
    max-width: $maxWidth
    min-width: $minWidth
    height: 380px
    position: relative
    font-size: 16px
    color: #FFFFFF
    background: #111
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
      right: 0
      top: 40px
    .company-detail
      width: 1020px
      height: 206px
      padding: 24px 30px
      box-sizing: border-box
      display: flex
      align-items: center
      position: absolute
      left: 0
      top: 40px
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
      object-fit: cover
  .top-msg
    max-width: $maxWidth
    min-width: $minWidth
    margin: -70px auto 0
    height: 70px
    position: relative
    .msg-box
      width: $minWidth
      margin: 0 auto
      height: 70px
      color: #ffffff
      display: flex
      font-family: $font-family-regular
    .msg-content
      display: flex
      align-items: center
      height: 70px
      &:hover .icon
        icon-image(icon-Jump2)
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
      height: 382px
      float: left
      margin-right: 10px
      margin-bottom: 20px
      &:nth-child(6n)
        margin-right: 0
    .pagination
      margin-top: 20px
    .no-data
      width: 200px
      height: 200px
      margin: 150px auto 0
    .no-image
      width: 160px
      height: 152px
      display: block
      margin: 0 auto
    .no-text
      font-size: $font-size-14
      color: #808080
      margin-top: 18px
      text-align: center
      font-family: $font-family-regular

  .bottom
    padding-bottom: 48px
</style>
