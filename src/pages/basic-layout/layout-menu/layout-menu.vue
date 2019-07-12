<template>
  <div class="layout-menu">
    <img :src="logo" alt="" class="logo hand" @click="$router.push('/')">
    <ul class="menu-wrapper">
      <li v-for="(item) in menuData" :key="item.path" class="menu-item-wrapper" :class="{active: checkIsActive(item)}" @click="navHandle(item)">
        <img v-if="checkIsActive(item) &&item.meta && item.meta.iconSelected" :src="item.meta.iconSelected" alt="">
        <img v-else-if="item.meta && item.meta.icon" :src="item.meta.icon" alt="">
        <span>{{item.meta && item.meta.title}}</span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed} from '@state/helpers'
  import {USER_TYPE} from '@utils/constant'

  const COMPONENT_NAME = 'LAYOUT_MENU'

  export default {
    name: COMPONENT_NAME,
    data() {
      const menuData = this.createMenuData(this.$router.options.routes)
      return {
        menuData
      }
    },
    computed: {
      ...authComputed,
      logo() {
        return this.currentUserType === USER_TYPE.SUPER
          ? require('./pic-white_logo@2x.png')
          : require('./pic-top_logo@2x.png')
      }
    },
    methods: {
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

  .layout-menu
    height :100%
    background :#5729D6
    box-shadow: 3px 0 4px 0 rgba(0,8,39,0.15);
    .logo
      width :130px
      height :60px
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
        &.active
          background : #5427D1
        & > img
          width: 28px
          height: 28px
        & > span
          margin-top :13px
</style>
