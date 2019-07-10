<template>
  <div class="basic-layout">
    <aside class="aside">
      <layout-menu></layout-menu>
    </aside>
    <header class="header-wrapper">
      <layout-crumb></layout-crumb>
    </header>
    <section class="content-wrapper">
      <router-view></router-view>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import LayoutCrumb from './layout-crumb/layout-crumb'
  import LayoutMenu from './layout-menu/layout-menu'
  const PAGE_NAME = 'BASIC_LAYOUT'
  const TITLE = '基布局'

  export default {
    name: PAGE_NAME,
    components: {
      LayoutCrumb,
      LayoutMenu
    },
    page: {
      title: TITLE
    },
    data() {
      const menuList = this.$router.options.routes.find(val => val.path === '/manager').children // todo
      console.log(menuList)
      return {
        menuList
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $asideWidth = 130px
  $topHeight = 40px
  @import "~@design"

  .basic-layout
    position :relative
    display flex
    .aside
      position :fixed
      width :$asideWidth
      height :100vh
      z-index :999
    .header-wrapper
      position :fixed
      left :$asideWidth
      right :0
      height :$topHeight
      background :red
      z-index :999
    .content-wrapper
      flex: 1
      border-left : $asideWidth solid transparent
      border-top : $topHeight solid transparent
      box-sizing :border-box
      min-height :100vh
      background $color-background
      padding :20px
</style>
