<template>
  <div class="layout-crumb">
    <ul class="crumb-wrapper">
      <li v-for="(item, index) in crumbData" :key="index">{{item}}<span v-if="index !== crumbData.length - 1" class="line">/</span></li>
    </ul>
    <section class="user-wrapper" @mouseenter="enterHandle" @mouseleave="leaveHandle">
      <img class="avatar" src="./pic-admin@2x.png" alt="">
      <span class="user-name">{{userInfo.username || userInfo.name}}</span>
      <div class="icon-logout">
        <img class="img" :class="{active: showTip}" src="./icon-sign_out1@2x.png" alt="">
        <img class="img" :class="{active: !showTip}" src="./icon-sign_out2@2x.png" alt="">
      </div>
      <transition name="fade" @mouseenter="enterHandle" @mouseleave="leaveHandle">
        <dl v-show="showTip" class="login-panel">
          <dt></dt>
          <dd @click="logoutHandle">退出登陆</dd>
        </dl>
      </transition>
    </section>
    <default-confirm ref="confirm" @confirm="confirmHandle"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {authMethod, authComputed} from '@state/helpers'
  import { USER_TYPE } from '@utils/constant'

  const COMPONENT_NAME = 'LAYOUT_CRUMB'

  export default {
    name: COMPONENT_NAME,
    components: {
      DefaultConfirm
    },
    data() {
      let crumbData = this.getCrumbData(this.$route.meta)
      return {
        crumbData: crumbData,
        showTip: false,
      }
    },
    computed: {
      ...authComputed,
      userInfo() {
        return this.currentUser || {}
      }
    },
    watch: {
      $route(val) {
        this.crumbData = this.getCrumbData(val.meta)
      }
    },
    methods: {
      ...authMethod,
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
        this.$refs.confirm && this.$refs.confirm.show('确定要退出?')
      },
      confirmHandle() {
        let path = '/'
        switch (this.currentUserType) {
        case USER_TYPE.SUPER:
          path = '/user/login-platform'
          break
        case USER_TYPE.MERCHANT:
          path = '/user/login'
          break
        default:
          break
        }
        this.clearAuth()
        this.$router.push({path})
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
    flex-wrap :nowrap
    box-sizing :border-box
    align-items :center
    padding :0 20px
    background :#fff
    color: #333;
    font-size :12px
    line-height :1
    .user-wrapper
      display :flex
      flex-wrap :nowrap
      align-items :center
      position relative
      height :100%
      color: #64A0F7
      cursor :pointer
      .avatar
        width: 24px
        height: 24px
        border-radius :100%
        border: 1px solid #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(51,51,51,0.10);
        margin-right :4px
      .icon-logout
        margin-left :8px
        width: 14px
        height: 15px
        position :relative
        .img
          position :absolute
          top:0
          left :0
          width :100%
          height :100%
          opacity : 1
          transition :opacity 0.3s
          &.active
            opacity : 0
      .login-panel
        position absolute
        top:50px
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
            color: #64A0F7
    .crumb-wrapper
      display flex
      flex: 1
      align-items :center
      flex-wrap :nowrap
      & > li:last-child
        color: #64A0F7
      .line
        margin :0 8px
        color: #e6eaed
</style>
