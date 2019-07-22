<template>
  <div class="layout-menu">
    <!--    <div class="header">-->
    <!--      <img src="" alt="" class="h-icon">-->
    <!--      <span class="h-text" :style="headerTextStyle">{{headerText}}</span>-->
    <!--    </div>-->
    <img :src="logoIcon" alt="" class="header">
    <ul class="menu-wrapper">
      <li v-for="(item) in menuData" :key="item.path" class="menu-item-wrapper" :class="{active: checkIsActive(item)}" @click="navHandle(item)">
        <img v-if="checkIsActive(item) &&item.meta && item.meta.iconSelected" :src="item.meta.iconSelected" alt="">
        <img v-else-if="item.meta && item.meta.icon" :src="item.meta.icon" alt="">
        <span>{{item.meta && item.meta.title}}</span>
        <div v-show="checkIsActive(item)" class="light-border"></div>
      </li>
    </ul>
    <div class="nav-wrapper" @click="navigationHandle">
      <span class="text">{{navConfig.text}}</span>
      <div class="icon"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed} from '@state/helpers'
  import {USER_TYPE} from '@utils/constant'

  const COMPONENT_NAME = 'LAYOUT_MENU'
  const NAV_CONFIG = {
    [USER_TYPE.MERCHANT]: {
      text: '访问店铺',
      url: '/business-detail'
    },
    [USER_TYPE.SUPER]: {
      text: '访问集市',
      url: '/'
    }
  }
  export default {
    name: COMPONENT_NAME,
    data() {
      const menuData = this.createMenuData(this.$router.options.routes)
      return {
        menuData,
        USER_TYPE
      }
    },
    computed: {
      ...authComputed,
      logoIcon() {
        return this.currentUserType === USER_TYPE.SUPER
          ? require('./pic-jishi_logo@2x.png')
          : require('./pic-supplier_logo@2x.png')
      },
      // headerText() {
      //   return this.currentUserType === USER_TYPE.SUPER
      //     ? '集市平台'
      //     : '供应商后台'
      // },
      // headerTextStyle() {
      //   return this.currentUserType === USER_TYPE.SUPER ? '        font-size :18px;': ''
      // },
      navConfig() {
        return NAV_CONFIG[this.userInfo.identity] || {}
      },
      userInfo() {
        return this.currentUser || {}
      }
    },
    created() {
    },
    methods: {
      navigationHandle() {
        // this.$router.push({path: this.navConfig.url, query: {supplierId: this.userInfo.id}})
        let routeUrl = this.$router.resolve({path: this.navConfig.url, query: {supplierId: this.userInfo.id}})
        window.open(routeUrl.href, '_blank')
      },
      createMenuData(routes) {
        let r = routes.find((r) => r.path === '/manager')
        let children = [...r.children]
        children = children.filter((item) => {
          if (item.meta && item.meta.authority && item.meta.authority.length) {
            return item.meta.authority.some((val) => val === this.$store.state.auth.currentUserType) && item
          }
        })
        return children
      },
      navHandle(item) {
        this.$router.push(item.path)
      },
      checkIsActive(item) {
        return this.$route.path.includes(item.path)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .nav-wrapper
    position :absolute
    bottom :10px
    left :0
    right :0
    height :50px
    display :flex
    align-items :center
    justify-content:center
    cursor :pointer
    &:before
      content: ''
      position :absolute
      height :1px
      background #393D79
      top: 0
      left: 10px
      right: @left
    & > .text
      font-family: $font-family-regular
      font-size: 16px
      color: #C6B2FF
      letter-spacing: 0
      text-align: center
      line-height: 16px
      padding-right :7px
      transition: all 0.2s
    & > .icon
      width: 18px
      height: 18px
      icon-image(icon-visit)
      transition: all 0.2s
    &:hover
      >.text
        color: #FFF
      >.icon
        icon-image(icon-visit_hover)

  .layout-menu
    height :100%
    background: #343870;
    box-shadow: 3px 0 4px 0 rgba(0,8,39,0.15);
    .header
      display :flex
      width :130px
      height :60px
      align-items :center
      justify-content :center
      .h-icon
        height: 20px
        width: @height
      .h-text
        padding-left :3px
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #FFFFFF;
        line-height: 1
    .menu-wrapper
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      line-height: 1
      .menu-item-wrapper
        height: 115px
        width: 130px
        display :flex
        flex-direction :column
        align-items :center
        justify-content :center
        cursor : pointer
        position :relative
        .light-border
          height: 100%
          width: 1px
          position absolute
          left :0
          top: 0
          background: #555CA7;
        &.active
          background: #3F4478;
          & > span
            opacity :1
            color: #1FBB91
        & > img
          width: 28px
          height: 28px
        & > span
          opacity :0.5
          margin-top :13px
</style>
