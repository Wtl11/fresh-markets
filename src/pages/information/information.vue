<template>
  <div class="information">
    <section class="banner-wrapper">
      <img src="./pic-logo@1x.png" alt="" class="banner-logo">
      <img src="./pic-banner_big.png" alt="" class="banner-img">
      <ul class="icon-wrapper">
        <template v-for="(item, index) in selectArray">
          <li
            v-if="index > 0 && index <= 10"
            :key="index"
            class="icon-item-wrapper"
            @click="navHandle(index)"
          >
            <div class="nav-icon-wrapper">
              <img v-if="item.image_url" :src="item.image_url" alt="" class="nav-icon">
            </div>
            <span>{{item.name}}</span>
          </li>
        </template>
      </ul>
    </section>
    <article class="body-wrapper">
      <ul class="tab-wrapper">
        <li v-for="(item, index) in tabList" :key="item.title" class="tab-item-wrapper" :class="{active: tabIndex === index}" @click="changeTabHandle(item, index)"><span>{{item.title}}</span><span class="explain">(已入驻{{item.number}}{{item.units}})</span></li>
      </ul>
      <div class="select-wrapper">
        <select-classify
          ref="selectFirst"
          :classifyData="selectArray"
          :defaultIndex="0"
          class="border-1"
          title="一级分类："
          @selectChange="selectChange($event, 'first')"
        ></select-classify>
        <select-classify
          v-if="isShowSendSelect"
          ref="selectSecond"
          :classifyData="selectSecondArray"
          class="border-left-1 border-right-1 border-bottom-1"
          title="二级分类："
          @selectChange="selectChange($event, 'second')"
        ></select-classify>
        <select-classify
          ref="selectThird"
          :classifyData="selectThirdArray"
          class="border-left-1 border-right-1 border-bottom-1"
          title="区域："
          @selectChange="selectChange($event, 'third')"
        ></select-classify>
      </div>
      <keep-alive>
        <section v-if="tabIndex" class="goods-list">
          <div v-for="(item, idx) in marketList" :key="idx" class="market-item-info">
            <market-info :marketInfo="item"></market-info>
          </div>
        </section>
        <section v-else class="goods-list">
          <div v-for="(item, idx) in goodsList" :key="idx" class="goods-item-box">
            <goods-item :goodsInfo="item"></goods-item>
          </div>
        </section>
      </keep-alive>
      <section>
        <goods-pagination v-if="pageDetail.total_page > 1" ref="pagination" :pagination="page" :pageDetail="pageDetail" @addPage="addPage"></goods-pagination>
      </section>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
// import * as Helpers from './helpers'
  import API from '@api'
  import SelectClassify from './select-classify/select-classify'
  import GoodsItem from '@components/goods-item/goods-item'
  import MarketInfo from './market-info/market-info'
  import GoodsPagination from '@components/goods-pagination/goods-pagination'

  const PAGE_NAME = 'INFORMATION'
  const TITLE = '赞播集市'

  export default {
    name: PAGE_NAME,
    components: {
      SelectClassify,
      GoodsItem,
      MarketInfo,
      GoodsPagination
    },
    page: {
      title: TITLE
    },
    data() {
      this.category_id = 0
      this.page = 1
      this.province = ''
      this.refreshTabNumber = false
      return {
        tabList: [
          {
            title: '商品',
            number: 0,
            units: '个商品'
          },
          {
            title: '供应商',
            number: 0,
            units: '家供应商'
          }
        ],
        tabIndex: 0,
        goodsList: [],
        marketList: [],
        isShowSendSelect: false,
        isShowThirdSelect: false,
        selectArray: [],
        selectSecondArray: [],
        selectThirdArray: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        }
      }
    },
    computed: {},
    watch: {
      tabIndex(cur, pre) {
        if (pre !== cur) {
          this.$refs.selectFirst && this.$refs.selectFirst.setSelectId(0)
          this.$refs.selectSecond && this.$refs.selectSecond.setSelectId(-1)
          this.$refs.selectThird && this.$refs.selectThird.setSelectId(-1)
        }
      }
    },
    created() {
      this._getGoodsClassifyList()
      this._getAreasList()
      this._getMarketList()
      this._getGoodsList()
    },
    methods: {
      addPage(page) {
        this.page = page
        this.getList()
      },
      _getGoodsClassifyList() {
        API.Information.getGoodsClassifyList({
          data: {parent_id: -1},
          formatter: (res) => {
            // let data = res.data.filter(item => {
            //   if (item.list && item.list.length) {
            //     return item
            //   }
            // })
            // data.unshift({name: '全部'})
            // res.data = data
            res.data.unshift({name: '全部'})
            return res
          }
        }).then((res) => {
          this.selectArray = res.data
        })
      },
      _getAreasList() {
        API.Information.getAreasList({
          formatter: (res) => {
            res.data = res.data.map((item) => {
              return {
                name: item
              }
            })
            return res
          }
        }).then((res) => {
          this.selectThirdArray = res.data
        })
      },
      _getGoodsList(loading) {
        API.Information.getGoodsList({
          data: {
            limit: 48,
            province: this.province,
            goods_supplier_category_id: this.category_id,
            page: this.page
          },
          loading
        }).then((res) => {
          this.goodsList = res.data
          if(this.refreshTabNumber || this.tabList[0].number === 0) {
            this.tabList[0].number = res.meta.total
            this.refreshTabNumber = false
          }
          this.setPageDetail(res.meta)
        })
      },
      // 供应商
      _getMarketList(loading) {
        API.Information.getMarketList({
          data: {
            limit: 8,
            province: this.province,
            goods_supplier_category_id: this.category_id,
            page: this.page
          },
          loading
        }).then((res) => {
          this.marketList = res.data
          if(this.refreshTabNumber || this.tabList[1].number === 0) {
            this.tabList[1].number = res.meta.total
            this.refreshTabNumber = false
          }
          this.setPageDetail(res.meta)
        })
      },
      setPageDetail(meta) {
        this.pageDetail = {
          total: meta.total,
          per_page: meta.per_page,
          total_page: meta.last_page
        }
      },
      changeTabHandle(item, index) {
        if (this.tabIndex === index) return
        this.refreshTabNumber = true
        this.selectChange(0, 'first')
        this.tabIndex = index
        this.page = 1
        this.category_id = ''
        this.province = ''
        this.getList()
      },
      navHandle(index) {
        this.$refs.selectFirst && this.$refs.selectFirst.setSelectId(index)
        this.selectChange(index, 'first')
      },
      selectChange(id, type) {
        switch (type) {
        case 'first':
          this.isShowSendSelect = id > 0
          this.selectSecondArray = this.selectArray[id].list
          this.$refs.selectThird && this.$refs.selectThird.setSelectId(-1)
          this.$refs.selectSecond && this.$refs.selectSecond.setSelectId(-1)
          this.category_id = id
          this.province = ''
          break
        case 'second':
          this.category_id = id
          this.$refs.selectThird && this.$refs.selectThird.setSelectId(-1)
          this.province = ''
          break
        case 'third':
          this.province = this.selectThirdArray[id].name
          break
        default:
          break
        }
        this.getList()
      },
      getList() {
        if (this.tabIndex) {
          this._getMarketList(false)
        } else {
          this._getGoodsList(false)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $maxWidth = 1920px
  $minWidth = 1400px
  @import "~@design"

  .border-1
    border: 1px solid $color-line
  .border-top-1
    border-top : 1px solid $color-line
  .border-left-1
    border-left : 1px solid $color-line
  .border-right-1
    border-right : 1px solid $color-line
  .border-bottom-1
    border-bottom : 1px solid $color-line

  .information
    font-family: $font-family-regular
    min-height :2238px
    .body-wrapper
      width :$minWidth
      margin :0 auto
      .tab-wrapper
        display :flex
        padding :24px 0 20px
        color: #333
        justify-content :center
        .tab-item-wrapper
          cursor :pointer
          font-size :20px
          height :40px
          line-height :@height
          background: transparent
          border-radius: 20px;
          padding :0 43px
          transition : all 0.3s
          opacity : 1
          &:hover
            opacity : 0.8
          &.active
            background: #FF520F;
            color: #fff
            & >>> .explain
              color: #fff
          &:first-child
            margin-right :161px
          .explain
            font-size :14px
            color: #999
            transition : all 0.3s
      .goods-list
        display: flex
        overflow: hidden
        flex-wrap: wrap
        padding-top: 20px
        .goods-item-box
          width: 225px
          height: 350px
          margin-bottom: 20px
          margin-right: 10px
          &:nth-child(6n)
            margin-right: 0
        .market-item-info
          width :100%
          margin-bottom :20px
    .banner-wrapper
      margin : 0 auto
      max-width :$maxWidth
      height :500px
      position :relative
      font-size: 16px;
      color: #FFFFFF;
      line-height: 1
      .banner-logo
        position absolute
        width: 160px
        height: 58px
        top:50px
        left: 130px
      .banner-img
        width :100%
        height :100%
        object-fit :cover
      .icon-wrapper
        position :absolute
        height :126px
        left :0
        right :0
        bottom :0
        background rgba(233,236,240,0.11)
        display :flex
        align-items :center
        justify-content :space-around
        min-width :$minWidth
        .icon-item-wrapper
          cursor :pointer
          display :flex
          flex-direction :column
          align-items :center
          justify-content :center
          &:hover >>> .nav-icon-wrapper
            transform :scale(1.2)
            top: -10px
          &:hover >>> span
            opacity :0.8
          .nav-icon-wrapper
            width: 54px
            height: 54px
            border-radius :100%
            overflow: hidden
            margin-bottom :10px
            transition : all 0.3s
            position :relative
            top: 0
            .nav-icon
              width :100%
              height :100%
            span
              opacity :1
              transition :all 0.3s

</style>
