<template>
  <div class="total">
    <!--<div class="page-title">{{pageDetail.per_page}}条/页，共{{pageDetail.total}}条数据</div>-->
    <div class="page">
      <div class="page-icon" :class="{'page-icon-disable': isHand.handLeft !== 'pointer'}" :style="{'cursor': isHand.handLeft}" @click="subtract" @mouseenter="notAllowed">
      </div>
      <!--{{page}}/{{pageDetail.total_page}}-->
      <div class="pade-detail">
        <span v-show="showFirst" class="page-child hand" @click="getPage(1)">1</span>
        <span v-show="preClipped" class="page-hide-more"></span>
        <span v-for="(num, index) in indexArr" :key="index" class="page-child hand" :class="{'page-child-active': page === num}" @click="getPage(num)">
          {{num}}
        </span>
        <span v-show="backClipped" class="page-hide-more"></span>
        <span v-show="showEnd" class="page-child hand" :class="{'page-child-active': page === pageDetail.total_page}" @click="getPage(pageDetail.total_page)">{{pageDetail.total_page}}</span>
      </div>
      <div class="page-icon page-icon-two" :class="{'page-icon-two-disable':isHand.handRight !== 'pointer'}" :style="{'cursor': isHand.handRight}" @click="addPage" @mouseenter="notAllowed">
      </div>
      <div class="page-box">
        <div class="border-page page-total" :class="[{'page-total-active': showMorePage}, {'one-page': +pageDetail.total_page === 1}]" @click.stop="showPageDetail">
          {{page}}/{{pageDetail.total_page}}
          <span class="page-tap">
            <i class="page-top" :class="{'page-bottom':showMorePage}"></i>
          </span>
          <transition name="fade">
            <ul v-show="showMorePage" class="page-list">
              <li v-for="item in pageDetail.total_page"
                  :key="item"
                  class="page-item"
                  :class="{'page-item-active': pageIndex === item}"
                  @click.stop="detailPage(item)"
              >
                {{item}}/{{pageDetail.total_page}}
              </li>
            </ul>
          </transition>
        </div>
      </div>
      <div class="input-box">
        跳至
        <div class="input-box-big">
          <input v-model.number="pageInput" type="number" class="border-page" @mousewheel.native.prevent @keydown="_runPage">
        </div>
        页
      </div>
      <!--<div class="border-page input-height-item" @click="goPage" @mouseenter="notAllowed" :style="{'cursor': isHand.handGo}">跳转</div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageDetail',
    props: {
      pageDetail: {
        type: Object,
        default: () => {
          return {
            total: 1, // 总数量
            per_page: 10, // 一页条数
            total_page: 1 // 总页数
          }
        }
      },
      pagination: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        showMorePage: false,
        pageInput: '',
        isHand: {handLeft: 'pointer', handRight: 'pointer', handGo: 'pointer'},
        pageIndex: 0,
        page: this.pagination,
        backClipped: true,
        preClipped: false,
        showFirst: false,
        showEnd: true
      }
    },
    computed: {
      indexArr() {
        /* eslint-disable */ // todo
      let ret = []
      if (this.pageDetail.total_page <= 9 && this.pageDetail.total_page > 0) {
        for (let i = 1; i <= this.pageDetail.total_page; i++) {
          this.showEnd = false
          this.backClipped = false
          ret.push(i)
        }
        return ret
      } else if (this.pageDetail.total_page === 0) {
        this.showEnd = false
        this.backClipped = false
        return [1]
      }
      if (this.page < 4) {
        this.backClipped = true
        this.showFirst = false
        this.preClipped = false
        this.showEnd = true
        for (let i = 1; i <= 4; i++) {
          ret.push(i)
        }
      } else if (this.page === 4) {
        this.backClipped = true
        this.showFirst = false
        this.preClipped = false
        for (let i = 1; i <= 6; i++) {
          ret.push(i)
        }
      } else if (this.page > 4 && this.page < this.pageDetail.total_page - 2) {
        this.showFirst = true
        this.preClipped = true
        this.showEnd = true
        this.backClipped = true
        for (let i = this.page - 2; i <= this.page + 2; i++) {
          ret.push(i)
        }
      } else if (this.page === this.pageDetail.total_page - 3) {
        this.showFirst = true
        this.showEnd = false
        this.backClipped = false
        this.preClipped = true
        for (let i = this.pageDetail.total_page - 3; i <= this.pageDetail.total_page; i++) {
          ret.push(i)
        }
      } else if (this.page > this.pageDetail.total_page - 3) {
        this.showFirst = true
        this.showEnd = false
        this.backClipped = false
        this.preClipped = true
        for (let i = this.pageDetail.total_page - 3; i <= this.pageDetail.total_page; i++) {
          ret.push(i)
        }
      }
      return ret
    }
  },
  created() {
    window.onclick = () => {
      this.hidePageDetail()
    }
  },
  methods: {
    _runPage(e) {
      if (e.keyCode === 13) {
        if (this.pageInput !== '') {
          if (this.pageInput > this.pageDetail.total_page) {
            this.pageInput = this.pageDetail.total_page
          } else if (this.pageInput * 1 <= 0) {
            this.pageInput = 1
          }
          this.pageInput = Math.floor(this.pageInput * 1)
          this.page = this.pageInput
          this.$emit('addPage', this.page)
        }
      }
    },
    getPage(page) {
      this.page = page
      this.$emit('addPage', this.page)
    },
    subtract() {
      if (this.page > 1) {
        this.page--
        this.$emit('addPage', this.page)
      }
      this.notAllowed()
    },
    notAllowed() {
      this.page === 1 ? (this.isHand.handLeft = 'not-allowed') : (this.isHand.handLeft = 'pointer')
      this.page === this.pageDetail.total_page
        ? (this.isHand.handRight = 'not-allowed')
        : (this.isHand.handRight = 'pointer')
      this.pageInput === '' ? (this.isHand.handGo = 'not-allowed') : (this.isHand.handGo = 'pointer')
    },
    addPage() {
      if (this.page < this.pageDetail.total_page) {
        this.page++
        this.$emit('addPage', this.page)
      }
    },
    showPageDetail() {
      this.showMorePage = !this.showMorePage
    },
    detailPage(page) {
      this.page = page
      this.pageIndex = page
      setTimeout(() => {
        this.hidePageDetail()
      }, 100)
      this.$emit('addPage', this.page)
    },
    hidePageDetail() {
      this.showMorePage = false
      this.focus = false
    },
    goPage() {
      if (this.pageInput !== '') {
        this.pageInput = Math.floor(this.pageInput * 1)
        if (this.pageInput > this.pageDetail.total_page) {
          this.pageInput = this.pageDetail.total_page
        } else if (this.pageInput * 1 <= 0) {
          this.pageInput = 1
        }
        this.page = this.pageInput
        this.$emit('addPage', this.page)
      }
    },
    beginPage(page = 1) {
      this.pageInput = ''
      this.page = page
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .total
    width: 100%
    height: 41px
    display: flex
    align-items: center
    justify-content: center
    color: #666
    font-size: $font-size-14
    .page-title
      font-size: $font-size-14
    .page
      display: flex
      align-items: center
      .pade-detail
        align-items: center
        display: flex
        text-align: center
        .page-child
          padding: 0 6.5px
          min-width: 41px
          height: 41px
          line-height: 41px
          box-sizing: border-box
          border-radius: 2px
          border: 0.5px solid $color-line
          font-size: 14px
          color: #666
          background: $color-white
          margin-right: 13px
          position: relative
          transition: all 0.3s ease-out
          &:after
            content: ''
            border-top: 0.5px solid transparent
            border-bottom: 0.5px solid transparent
            position: absolute
            z-index: 5
            height: 100%
            width: 0
            right: 0
            top: -0.5px
            box-sizing: content-box
            transition: all 0.3s ease-out
            border-radius: 2px
          &:before
            content: ''
            border-right: 0.5px solid transparent
            border-left: 0.5px solid transparent
            position: absolute
            z-index: 5
            height: 0
            width: 100%
            bottom: 0
            left: -0.5px
            box-sizing: content-box
            transition: all 0.3s ease-out
            border-radius: 2px
        .page-child-active
          transition: all 0.3s ease-out
          font-family: $font-family-medium
          color: #FF520F
          border-color: #FF520F

        .page-hide-more
          width: 20px
          height: 4px
          display: inline-block
          margin-right: 13px
          icon-image('icon-spot')

      .page-icon
        cursor: pointer
        icon-image('icon-left_no')
        margin-right: 13px
        height: 41px
        width: 41px
        border-radius: 2px
        transition: all 0.3s
        &:hover
          transition: all 0.3s
          icon-image('pic-paging_left2')
      .page-icon-disable
        icon-image('icon-left_no')
        &:hover
          transition: all 0.3s
          icon-image('icon-left_no')
      .page-icon-two
        transition: all 0.3s
        icon-image('icon-right_no')
        &:hover
          transition: all 0.3s
          icon-image('icon-right_hover')
      .page-icon-two-disable
        icon-image('icon-right_no')
        &:hover
          transition: all 0.3s
          icon-image('icon-right_no')
      .border-page
        display: flex
        line-height: 41px
        border-radius: 2px
        margin: 0 10px
        border: 0.5px solid $color-line
        font-size: 14px
      div.border-page
        margin-right: 0
        padding: 0 15px
        height: 41px
        line-height: 41px
        border-radius: 2px
        cursor: pointer
        background: $color-white
      div.page-total
        cursor: pointer
        padding-right: 24px
        position: relative
        margin: 0
        color: #666
        transition: all 0.2s
        &:hover
          border-color: #ACACAC
          .page-tap .page-top
            background: url("./icon-up@2x.png")
            background-size: 100% 100%
        .page-tap
          position: absolute
          right: 0
          top: 0
          height: 39px
          display: inline-block
          width: 24px
          .page-top
            position: absolute
            left: 50%
            top: 50%
            margin-left: -7px
            margin-top: -6px
            width: 13px
            height: 13px
            background: url("./icon-pressed_down.png")
            background-size: 100% 100%
            transition: all 0.2s
            transform: rotate(0deg)
          .page-bottom
            transform: rotate(180deg)
            background: url("./icon-up@2x.png")
            background-size: 100% 100%
        .page-list
          position: absolute
          width: 100%
          left: 0
          box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
          text-align: center
          background: #fff
          border-radius: 2px
          bottom: 45px
          font-size: 14px
          color: $color-text-sub
          max-height: 290px
          overflow-y: auto
          z-index: 99
          &.fade-enter, &.fade-leave-to
            opacity: 0
          &.fade-enter-to, &.fade-leave-to
            transition: all .3s ease-in-out
          .page-item
            cursor: pointer
            color: #666
            height: 29px
            line-height: 29px
            &:hover
              background: #FAFAFA
          .page-item-active
            background: #FAFAFA
      .page-total-active
        border: 0.5px solid #FF520F !important
      .input-box-big
        position: relative
        margin: 0 15px
        transition: all 0.4s ease-out
        input.border-page
          position: relative
          z-index: 10
          height: 41px
          width: 73px
          border-radius: 2px
          margin: 0
          text-align: center
          transition: all 0.4s ease-out
          &:hover
            border: 0.5px solid #ACACAC
          &:focus
            border: 0.5px solid #FF520F
          &::-webkit-inner-spin-button
            appearance: none

      .input-box
        font-size: 14px
        white-space: nowrap
        display: flex
        height: 41px
        align-items: center
        margin-right: 13px
      .page-box
        min-width: 101px
        height: 41px
        margin-right: 15px
</style>
