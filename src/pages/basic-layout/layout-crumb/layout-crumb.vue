<template>
  <div class="layout-crumb">
    <ul class="crumb-wrapper">
      <li v-for="(item, index) in crumbData" :key="index">{{item}}<span v-if="index !== crumbData.length - 1" class="line">/</span></li>
    </ul>
    <section class="user-wrapper" @mouseenter="enterHandle" @mouseleave="leaveHandle">
      <span>你好: super</span>
      <img src="./icon-sign_out@2x.png" alt="">
      <transition name="fade" @mouseenter="enterHandle" @mouseleave="leaveHandle">
        <dl v-show="showTip" class="login-panel">
          <dt></dt>
          <dd @click="logoutHandle">退出登陆</dd>
        </dl>
      </transition>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'LAYOUT_CRUMB'

  export default {
    name: COMPONENT_NAME,
    data() {
      let crumbData = this.getCrumbData(this.$route.meta)
      return {
        crumbData: crumbData,
        showTip: false
      }
    },
    watch: {
      $route(val) {
        this.crumbData = this.getCrumbData(val.meta)
      }
    },
    methods: {
      getCrumbData(meta) {
        return meta.crumbs || []
      },
      enterHandle() {
        this.showTip = true
        clearTimeout(this.timer)
      },
      leaveHandle() {
        this.timer = setTimeout(() => {
          this.showTip = false
        }, 500)
      },
      logoutHandle() {
        this.$router.push({name: 'login'})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .layout-crumb
    font-family :$font-family-regular
    width: 100%
    height :100%
    display :flex
    box-sizing :border-box
    align-items :center
    padding :0 20px
    background :#fff
    color: #333;
    font-size :12px
    line-height :1
    .user-wrapper
      display :flex
      align-items :center
      position relative
      height :100%
      & > img
        margin-left :8px
        width: 10px
        height: @width
      .login-panel
        position absolute
        top:36px
        row-center()
        width :106px
        color: #333
        background :#fff
        font-size :14px
        border-radius :4px
        box-shadow: 0 0 8px 0 #ebebeb
        cursor :pointer
        & > dt
          position absolute
          border: 5px solid #fff
          border-top-color :transparent
          border-left-color :transparent
          border-right-color :transparent
          top: -10px
          right :10px
        & > dd
          height :50px
          line-height :50px
          padding-left :16px
          &:hover
            color: #4dbd65
    .crumb-wrapper
      display flex
      flex: 1
      align-items :center
      & > li:last-child
        color: #4dbd65
      .line
        margin :0 8px
        color: #e6eaed
</style>
