<template>
  <div class="information">
    <section class="banner-wrapper">
      <img src="./pic-banner_big.png" alt="" class="banner-img">
      <ul class="icon-wrapper">
        <li v-for="(item, index) in navList" :key="index" class="icon-item-wrapper">
          <div class="nav-icon-wrapper">
            <img src="http://pic25.nipic.com/20121205/10197997_003647426000_2.jpg" alt="" class="nav-icon">
          </div>
          <span>网红零食</span>
        </li>
      </ul>
    </section>
    <article class="body-wrapper">
      <ul class="tab-wrapper">
        <li v-for="(item, index) in tabList" :key="item.title" class="tab-item-wrapper" :class="{active: tabIndex === index}" @click="changeTabHandle(item, index)"><span>{{item.title}}</span><span class="explain">(已入驻{{item.number}}{{item.units}})</span></li>
      </ul>
      <div class="select-wrapper">
        <select-classify></select-classify>
      </div>
      <div class="goods-list">
        <div class="goods-item-box" v-for="(item, idx) in goodsList" :key="idx">
          <goods-item></goods-item>
        </div>
      </div>
    </article>
    <input type="file" @change="changeHandle">
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import {uploadFiles} from '../../utils/cos/cos'
  import SelectClassify from './select-classify/select-classify'
  import GoodsItem from '@components/goods-item/goods-item'
  const PAGE_NAME = 'INFORMATION'
  const TITLE = '信息平台'

  export default {
    name: PAGE_NAME,
    components: {
      SelectClassify,
      GoodsItem
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        navList: new Array(10).fill(1),
        tabList: [
          {
            title: '商品',
            number: 3090,
            units: '个商品'
          },
          {
            title: '供应商',
            number: 30901,
            units: '家供应商'
          }
        ],
        tabIndex: 0,
        goodsList: new Array(30).fill(1)
      }
    },
    methods: {
      changeHandle(e) {
        console.log([e.target.files[0]])
        uploadFiles({files: [e.target.files[0]]}).then(res => {
          console.log(res)
        })
      },
      changeTabHandle(item, index) {
        this.tabIndex = index
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $maxWidth = 1920px
  $minWidth = 1400px
  @import "~@design"

  .information
    font-family: $font-family-regular
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
    .banner-wrapper
      margin : 0 auto
      max-width :$maxWidth
      height :500px
      position :relative
      font-size: 16px;
      color: #FFFFFF;
      line-height: 1
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
        .icon-item-wrapper
          cursor :pointer
          display :flex
          flex-direction :column
          align-items :center
          justify-content :center
          &:hover >>> .nav-icon-wrapper
            transform :scale(1.2)
          .nav-icon-wrapper
            width: 54px
            height: 54px
            border-radius :100%
            overflow :hidden
            margin-bottom :10px
            transition : transform 0.1s
            .nav-icon
              width :100%
              height :100%
              object-fit :cover

</style>
